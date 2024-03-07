import { Request, Response } from "express";
import Product from "../../db/models/Product";
import getUrlImageS3 from "../../shared/helpers/getUrlImageS3";

export const getByName = async (req: Request, res: Response) => {
  const {name} = req.params;

  if (!name) {
    return res.status(400).json({
      message: 'insira o nome do produto'
    })
  }

  const regex = new RegExp(name, 'i');


try {
  const products = await Product.find({ name: regex, active: true });

  if (!products) {
    res.status(422).json({
      message: "Nenhum produto não encontrado",
    });
    return;
  }

  for (const product of products) {
    for (let i = 0; i < product.images.length; i++) {
      const url = await getUrlImageS3("products", product?.images[i]);

      product.images[i] = url ?? "";
    }
  }

 return res.status(200).json({
    products,
  });
} catch (error) {
  console.log(error)
  return res.status(404).json({
    message: "erro no getByName", error
  })
}
};

import { Request, Response } from "express";
import Product from "../../db/models/Product";
import getUrlImageS3 from "../../shared/helpers/getUrlImageS3";

export const getBySales = async (req: Request, res: Response) => {

try {
  const products = await Product.find().sort({sales : -1});

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

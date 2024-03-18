import { Request, Response } from "express";
import Product from "../../db/models/Product";
import testeID from "../../shared/helpers/verifyId";

import ('dotenv/config')

const IMAGE_URL = process.env.IMAGE_URL

export const getProductById = async (req: Request, res: Response) => {
  const id = req.params.id;

  const isValidId = testeID(id)

  if (!isValidId) {
    res.status(422).json({
      message: "ID inválido, produto não encontrado",
    });
    return;
  }

try {
  const product = await Product.findById(id);

  if (!product) {
    res.status(422).json({
      message: "produto não encontrado",
    });
    return;
  }

  for (let i = 0; i < product.images.length; i++) {

    product.images[i] = `${IMAGE_URL}/products/${product.images[i]}`;

  }
  res.status(200).json({
    product,
  });
} catch (error) {
  console.log(error)
return res.status(404).json({
  message: "erro no getById", error
})
}
};



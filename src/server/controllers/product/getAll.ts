import { Request, Response } from "express";
import Product from "../../db/models/Product";
import getUrlImageS3 from "../../shared/helpers/getUrlImageS3";
import { ProductDataBackEnd } from "../../shared/helpers/Interfaces";


import ('dotenv/config')

const IMAGE_URL = process.env.IMAGE_URL


export const getAll = async (req: Request, res: Response) => {
try {
  const products = (await Product.find().sort(
    "-createdAt",
  )) as unknown as ProductDataBackEnd[];

  if (!products) {
    return res.status(200).json({
      message: "nenhum item encontrado",
    });
  }

  for (const product of products) {
    for (let i = 0; i < product.images.length; i++) {

      product.images[i] = `${IMAGE_URL}/products/${product.images[i]}`;

    }
  }

  return res.status(200).json({
    products,
  });
} catch (error) {
  console.log(error)
return res.status(404).json({
  message: "erro no getAll", error
})
}
};



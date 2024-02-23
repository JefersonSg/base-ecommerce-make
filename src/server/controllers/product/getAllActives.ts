import { Request, Response } from "express";
import Product from "../../db/models/Product";
import getUrlImageS3 from "../../shared/helpers/getUrlImageS3";
import { ProductDataBackEnd } from "../../shared/helpers/Interfaces";

export const getAllActives = async (req: Request, res: Response) => {
  const products = (await Product.find({active: true}).sort(
    "-createdAt",
  )) as unknown as ProductDataBackEnd[];

  if (!products) {
    return res.status(200).json({
      message: "nenhum item encontrado",
    });
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
};

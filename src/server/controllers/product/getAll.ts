import { Request, Response } from "express";
import Product from "../../db/models/Product";
import getUrlImageS3 from "../../shared/helpers/getUrlImageS3";

interface ProductData {
  name: string;
  brand: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  colors: string[];
  codeColors: string[];
  amountP: number;
  amountM: number;
  amountG: number;
  amountGG: number;
  promotion: boolean;
  promotionalPrice: number;
  active: boolean;
}

export const getAll = async (req: Request, res: Response) => {
  const products = await Product.find().sort("-createdAt") as unknown as ProductData[];

  if (!products) {
    return res.status(200).json({
      message: "nenhum item encontrado",
    });
  }
  
  for (const product of products) {
    for (let i = 0; i < product.images.length; i++) {

      const url = await getUrlImageS3(product?.images[i])


      product.images[i] = url ?? ''
    }
  }

  return res.status(200).json({
    products,
  });
};

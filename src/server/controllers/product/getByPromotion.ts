import { Request, Response } from "express";
import Product from "../../db/models/Product";


import ('dotenv/config')

const IMAGE_URL = process.env.IMAGE_URL

export const getByPromotion = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({promotion: true}).sort({ updatedAt: -1 });

    if (!products) {
      res.status(422).json({
        message: "Nenhum produto não encontrado",
      });
      return;
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
    console.log(error);
    return res.status(404).json({
      message: "erro no getByName",
      error,
    });
  }
};

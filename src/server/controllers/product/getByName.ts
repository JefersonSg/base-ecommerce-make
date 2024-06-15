import { type Request, type Response } from "express";
import Product from "../../db/models/Product";

import("dotenv/config");

const IMAGE_URL = process.env.IMAGE_URL;

export const getByName = async (req: Request, res: Response) => {
  const { name } = req.params;

  if (!name) {
    return res.status(400).json({
      message: "insira o nome do produto",
    });
  }

  const regex = new RegExp(name, "i");

  try {
    const products = await Product.find({ name: regex, active: true });

    if (!products) {
      res.status(422).json({
        message: "Nenhum produto não encontrado",
      });
      return;
    }

    for (const product of products) {
      if (product?.coverPhoto1) {
        product.coverPhoto1 = `${IMAGE_URL}/products/${product.coverPhoto1}`;
      }
      if (product?.coverPhoto2) {
        product.coverPhoto2 = `${IMAGE_URL}/products/${product.coverPhoto2}`;
      }
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

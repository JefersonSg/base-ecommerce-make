import { Request, Response } from "express";
import Product from "../../db/models/Product";
import testeID from "../../shared/helpers/verifyId";


import ('dotenv/config')

const IMAGE_URL = process.env.IMAGE_URL

export const getBySubcategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const isValidId = testeID(id);

  if (!isValidId) {
    res.status(422).json({
      message: "ID inválido, produto não encontrado",
    });
    return;
  }

  const products = await Product.find({ subcategory: id, active: true });

  if (!products) {
    res.status(422).json({
      message: "Nenhum produto foi encontrado",
    });
    return;
  }

  try {
    for (const product of products) {
      for (let i = 0; i < product.images.length; i++) {
        
    product.images[i] = `${IMAGE_URL}/products/${product.images[i]}`;
        
      }
    }

    res.status(200).json({
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "erro no getBySubcategory",
      error,
    });
  }
};

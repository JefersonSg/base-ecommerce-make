import { Request, Response } from "express";
import SubcategoryModel from "../../db/models/Subcategory";
import testeID from "../../shared/helpers/verifyId";

import ('dotenv/config')

const IMAGE_URL = process.env.IMAGE_URL

export const getByCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  if (!testeID(categoryId)) {
    res.status(422).json({
      message: "ID inválido, Categoria não encontrada",
    });
    return;
  }

  try {
    const subcategories = await SubcategoryModel.find({ category: categoryId });

    if (!subcategories) {
      res.status(422).json({
        message: "nenhuma subcategoria encontrada",
      });
      return;
    }

    for (const subcategory of subcategories) {
      
      subcategory.image = `${IMAGE_URL}/products/${subcategory.image}`;

    }

    res.status(200).json({ subcategories });
  } catch (error) {
    console.log("erro no delete getByCategory", error);
    return res.status(500).json({
      message: "erro no delete getByCategory",
      error,
    });
  }
};

import { Request, Response } from "express";

import Category from "../../db/models/Category";
import testeID from "../../shared/helpers/verifyId";

import ('dotenv/config')

const IMAGE_URL = process.env.IMAGE_URL

export const getById = async (req: Request, res: Response) => {
  const id = req.params.id;

  const isValidId = testeID(id);

  if (!isValidId) {
    res.status(422).json({
      message: "ID inválido, Categoria não encontrada",
    });
    return;
  }

  try {
    const category = await Category.findById(id);

    if (!category) {
      res.status(422).json({
        message: "Categoria não encontrada",
      });
      return;
    }
    if (!category.image) {
      return res.status(200).json({
        category,
      });
    }

    category.image = `${IMAGE_URL}/category/${category.image}`;
    
    res.status(200).json({
      category,
    });
  } catch (error) {
    console.log("erro no getById category", error);
    return res.status(500).json({
      message: "erro no getById category",
      error,
    });
  }
};

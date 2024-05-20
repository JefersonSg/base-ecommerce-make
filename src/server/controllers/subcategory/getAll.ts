import { type Request, type Response } from "express";
import SubcategoryModel from "../../db/models/Subcategory";

import("dotenv/config");

const IMAGE_URL = process.env.IMAGE_URL;

export const getAll = async (req: Request, res: Response) => {
  const subcategories = await SubcategoryModel.find().sort("-createdAt");

  if (!subcategories) {
    res.status(422).json({
      message: "Nenhuma subcategoria foi encontrada",
    });
    return;
  }

  for (const subcategory of subcategories) {
    if (subcategory.image) {
      subcategory.image = `${IMAGE_URL}/subcategory/${subcategory.image}`;
    }
  }

  try {
    res.status(200).json({
      subcategories,
    });
  } catch (error) {
    console.log("erro no getAll subcategory", error);
    return res.status(500).json({
      message: "erro no getAll subcategory",
      error,
    });
  }
};

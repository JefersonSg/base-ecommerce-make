import { Request, Response } from "express";
import Category from "../../db/models/Category";

import ('dotenv/config')

const IMAGE_URL = process.env.IMAGE_URL

interface category {
  name: string;
  description: string;
  image: string;
}

export const getAll = async (req: Request, res: Response) => {
  const categories = (await Category.find().sort("-createdAt")) as category[];

  if (!categories) {
    res.status(422).json({
      message: "Nenhuma categoria foi encontrada",
    });
    return;
  }
  for (const category of categories) {

    category.image = `${IMAGE_URL}/category/${category.image}`;

  }

  try {
    res.status(200).json({
      categories,
    });
    return;
  } catch (error) {
    console.log("erro no getAll categories", error);
    return res.status(500).json({
      message: "erro no getAll categories",
      error,
    });
  }
};

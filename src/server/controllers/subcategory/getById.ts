import { type Request, type Response } from "express";

import SubcategoryModel from "../../db/models/Subcategory";
import testeID from "../../shared/helpers/verifyId";

import("dotenv/config");

const IMAGE_URL = process.env.IMAGE_URL;

export const getById = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!testeID(id)) {
    res.status(422).json({
      message: "ID inválido, Subcategoria não encontrada",
    });
    return;
  }

  try {
    const subcategory = await SubcategoryModel.findById(id);

    if (!subcategory) {
      res.status(422).json({
        message: "subcategoria não encontrada",
      });
      return;
    }

    if (!subcategory.image) return res.status(200).json({ subcategory });

    subcategory.image = `${IMAGE_URL}/subcategory/${subcategory.image}`;

    res.status(200).json({
      subcategory,
    });
  } catch (error) {
    console.log("erro no getById subcategory", error);
    return res.status(500).json({
      message: "erro no getById subcategory",
      error,
    });
  }
};

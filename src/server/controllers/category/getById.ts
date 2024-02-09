import { Request, Response } from "express";

import mongoose from "mongoose";
import Category from "../../db/models/Category";
const ObjectId = mongoose.Types.ObjectId;

export const getCategoryById = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    res.status(422).json({
      message: "ID inválido, Categoria não encontrada",
    });
    return;
  }

  const category = await Category.findById(id);

  if (!category) {
    res.status(422).json({
      message: "Categoria não encontrada",
    });
    return;
  }
  res.status(200).json({
    category,
  });
};

import { Request, Response } from "express";

import mongoose from "mongoose";
import Category from "../../db/models/Category";
import getUrlImageS3 from "../../shared/helpers/getUrlImageS3";
const ObjectId = mongoose.Types.ObjectId;

export const getById = async (req: Request, res: Response) => {
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
  if (!category.image) {
    return res.status(200).json({
      category,
    });
  }
  const url = await getUrlImageS3("category", category?.image);

  category.image = url;
  res.status(200).json({
    category,
  });
};

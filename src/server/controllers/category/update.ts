import { Request, Response } from "express";
import Category from "../../db/models/Category";

import mongoose from "mongoose";
import {
  removeImageS3,
  updateImageToS3,
  uploadToS3,
} from "../../shared/helpers/imageUpload";
const ObjectId = mongoose.Types.ObjectId;

interface Categories {
  name: string;
  description: string;
  image: string;
}

export const updateCategory = async (req: Request, res: Response) => {
  const id = req.params.id;

  const name = req.body.name;
  const description = req.body.description;
  const image: any = req.file;

  const updateData: Categories | any = {};

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

  // Validations
  if (!name) {
    res.status(422).json({ message: "O nome da categoria é obrigatória!" });
    return;
  } else {
    updateData.name = name;
  }

  if (!description) {
    res
      .status(422)
      .json({ message: "A descrição da categoria é obrigatória!" });
    return;
  } else {
    updateData.description = description;
  }

  if (image && category.image) {
    const newImage = await uploadToS3("category", image);
    await removeImageS3("category", category?.image);
    updateData.image = newImage;
  }

  await Category.findByIdAndUpdate(id, updateData);

  res
    .status(200)
    .json({ category, message: "Categoria atualizada com sucesso!" });
};

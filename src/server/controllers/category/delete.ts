import { Request, Response } from "express";
import Category from "../../db/models/Category";

import mongoose from "mongoose";
import { removeImageS3 } from "../../shared/helpers/imageUpload";
const ObjectId = mongoose.Types.ObjectId;

export const deleteCategory = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.status(422).json({ message: "ID inválido!" });
    return;
  }

  const category = await Category.findOne({ _id: id });
  if (!category) {
    res.status(404).json({ message: "Categoria não encontrada!" });
    return;
  }

  try {
    if (category.image) await removeImageS3("category", category.image);
    await Category.findByIdAndRemove(id);

    res.status(200).json({ message: "Categoria removida com sucesso!" });
  } catch (erro) {
    console.log(erro);
  }
};

import { Request, Response } from "express";
import Category from "../../db/models/Category";

import mongoose from "mongoose";
import { removeImageS3 } from "../../shared/helpers/imageUpload";
import SubcategoryModel from "../../db/models/Subcategory";
const ObjectId = mongoose.Types.ObjectId;

export const deleteSubcategory = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.status(422).json({ message: "ID inválido!" });
    return;
  }

  const Subcategory = await SubcategoryModel.findOne({ _id: id });
  if (!Subcategory) {
    res.status(404).json({ message: "Subcategoria não encontrada!" });
    return;
  }

  try {
    if (Subcategory.image) await removeImageS3('subcategory', Subcategory.image);
    await Category.findByIdAndRemove(id);

    res.status(200).json({ message: "Subcategoria removida com sucesso!" });
  } catch (erro) {
    console.log(erro);
  }
};

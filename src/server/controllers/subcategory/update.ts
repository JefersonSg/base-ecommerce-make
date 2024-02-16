import { Request, Response } from "express";
import SubcategoryModel from "../../db/models/Subcategory";

import mongoose from "mongoose";
import {
  removeImageS3,
  updateImageToS3,
  uploadToS3,
} from "../../shared/helpers/imageUpload";
const ObjectId = mongoose.Types.ObjectId;

interface Subcategories {
  name: string;
  description: string;
  category: string;
  image: string;
}

export const update = async (req: Request, res: Response) => {
  const id = req.params.id;

  const name = req.body.name;
  const description = req.body.description;
  const category = req.body.category;
  const image: any = req.file;

  const updateData: Subcategories | any = {};

  if (!ObjectId.isValid(id)) {
    res.status(422).json({
      message: "ID inválido, Categoria não encontrada",
    });
    return;
  }

  const subcategory = await SubcategoryModel.findById(id);

  if (!subcategory) {
    res.status(422).json({
      message: "Subcategoria não encontrada",
    });
    return;
  }

  // Validations
  if (!name) {
    res.status(422).json({ message: "O nome da subcategoria é obrigatória!" });
    return;
  } else {
    updateData.name = name;
  }

  if (!description) {
    res
      .status(422)
      .json({ message: "A descrição da subcategoria é obrigatória!" });
    return;
  } else {
    updateData.description = description;
  }
  if (!category) {
    res.status(422).json({ message: "A categoria é obrigatória!" });
    return;
  } else {
    updateData.category = category;
  }

  if (image && subcategory.image) {
    const newImage = await uploadToS3("subcategory", image);
    updateData.image = newImage;

    await removeImageS3("subcategory", subcategory.image);
  }

  await SubcategoryModel.findByIdAndUpdate(id, updateData);

  res
    .status(200)
    .json({ subcategory, message: "Categoria atualizada com sucesso!" });
};

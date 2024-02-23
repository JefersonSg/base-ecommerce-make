import { Request, Response } from "express";
import Category from "../../db/models/Category";
import mongoose from "mongoose";
import {
  removeImageS3,
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
  const {name, description} = req.body;
  const image: any = req.file;

  const updateData: Categories | any = {name, description};

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

try {
  if (image && category.image) {
    const newImage = await uploadToS3("category", image);
    await removeImageS3("category", category?.image);
    updateData.image = newImage;
  }
  await Category.findByIdAndUpdate(id, updateData);

  return res
    .status(200)
    .json({ category, message: "Subcategoria atualizada com sucesso!" });
} catch (error) {
  console.log(error)
  return res.status(401).json({
  message: 'erro ao fazer update' + error
})
}};

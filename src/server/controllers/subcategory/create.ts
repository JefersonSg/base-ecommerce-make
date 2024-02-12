import { Request, Response } from "express";
import { uploadToS3 } from "../../shared/helpers/imageUpload";
import Category from "../../db/models/Category";
import SubcategoryModel from "../../db/models/Subcategory";

export const createSubcategory = async (req: Request, res: Response) => {
  const name = req.body.name;
  const description = req.body.description;
  const category = req.body.category;
  const image: any = req.file;

  if (!image) {
    res.status(422).json({
      message: "A imagem é obrigatoria",
    });
    return;
  }

  const imageUpload = await uploadToS3('subcategory',image);

  if (!imageUpload) {
    return res.status(404).send({
      message: "erro ao enviar imagem",
    });
  }

  // create Category
  const subcategory = new SubcategoryModel({
    name,
    description,
    category,
    image: imageUpload,
  });
  try {
    const newSubcategory = await subcategory.save();
    res.status(200).json({
      message: "Subcategoria criada com sucesso",
      newSubcategory,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
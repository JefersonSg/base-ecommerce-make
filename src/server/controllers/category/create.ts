import { Request, Response } from "express";
import { uploadToS3 } from "../../shared/helpers/imageUpload";
import Category from "../../db/models/Category";

export const createCategory = async (req: Request, res: Response) => {
  const name = req.body.name;
  const description = req.body.description;
  const image: any = req.file;

  if (!image) {
    res.status(422).json({
      message: "A imagem é obrigatoria",
    });
    return;
  }

  const imageUpload = await uploadToS3(image);

  if (!imageUpload) {
    return res.status(404).send({
      message: "erro ao enviar imagem",
    });
  }

  // create Category
  const category = new Category({
    name,
    description,
    image: imageUpload,
  });
  try {
    const newCategory = await category.save();
    res.status(200).json({
      message: "Categoria criada com sucesso",
      newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

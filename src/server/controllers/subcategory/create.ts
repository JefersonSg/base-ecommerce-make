import { type Request, type Response } from "express";
import { uploadToS3 } from "../../shared/helpers/imageUpload";
import SubcategoryModel from "../../db/models/Subcategory";
import { verifyMimetypeImage } from "../../shared/helpers/verifyMimetype";
import { verifySizeImage } from "../../shared/helpers/verifySize";

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
  if (verifySizeImage(image)) {
    return res.status(401).json({
      message: verifySizeImage(image),
    });
  }

  if (verifyMimetypeImage(image)) {
    return res.status(401).json({
      message: verifyMimetypeImage(image),
    });
  }

  const imageUpload = await uploadToS3("subcategory", image);

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
    console.log("erro no create subcategory", error);
    return res.status(500).json({
      message: "erro no create subcategory",
      error,
    });
  }
};

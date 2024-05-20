import { type Request, type Response } from "express";
import Category from "../../db/models/Category";
import { removeImageS3, uploadToS3 } from "../../shared/helpers/imageUpload";
import testeID from "../../shared/helpers/verifyId";
import { type CategoryInterface } from "../../shared/helpers/Interfaces";
import { verifySizeImage } from "../../shared/helpers/verifySize";
import { verifyMimetypeImage } from "../../shared/helpers/verifyMimetype";

export const updateCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, description } = req.body;
  const image: any = req.file;

  const updateData: CategoryInterface | any = { name, description };
  const isValidId = testeID(id);

  if (!isValidId) {
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

      const newImage = await uploadToS3("category", image);
      await removeImageS3("category", category?.image);
      updateData.image = newImage;
    }
    await Category.findByIdAndUpdate(id, updateData);

    return res
      .status(200)
      .json({ category, message: "Subcategoria atualizada com sucesso!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "erro ao fazer update",
      error,
    });
  }
};

import { Request, Response } from "express";
import SubcategoryModel from "../../db/models/Subcategory";
import { removeImageS3, uploadToS3 } from "../../shared/helpers/imageUpload";
import testeID from "../../shared/helpers/verifyId";
import { SubcategoryInterface } from "../../shared/helpers/Interfaces";
import { verifySizeImage } from "../../shared/helpers/verifySize";
import { verifyMimetypeImage } from "../../shared/helpers/verifyMimetype";

export const update = async (req: Request, res: Response) => {
  const id = req.params.id;

  const { name, description, category } = req.body;
  const image: any = req.file;
  const updateData: SubcategoryInterface | any = {
    name,
    description,
    category,
  };

  if (!testeID(id)) {
    res.status(422).json({
      message: "ID inválido, Categoria não encontrada",
    });
    return;
  }

  try {
    const subcategory = await SubcategoryModel.findById(id);

    if (!subcategory) {
      res.status(422).json({
        message: "Subcategoria não encontrada",
      });
      return;
    }

    // Validations

    if (image && subcategory.image) {
      if (verifySizeImage(image)) {
        return res.status(401).json({
          message : verifySizeImage(image)
        })
      }
  
      if (verifyMimetypeImage(image)) {
        return res.status(401).json({
          message : verifyMimetypeImage(image)
        })
      }
      
      const newImage = await uploadToS3("subcategory", image);

      updateData.image = newImage;

      await removeImageS3("subcategory", subcategory.image);
    }

    await SubcategoryModel.findByIdAndUpdate(id, updateData);

    return res
      .status(200)
      .json({ subcategory, message: "Categoria atualizada com sucesso!" });
  } catch (error) {
    console.log("erro no update subcategory", error);
    return res.status(500).json({
      message: "erro no update subcategory",
      error,
    });
  }
};

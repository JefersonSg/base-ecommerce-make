import { type Request, type Response } from "express";

import { removeImageS3 } from "../../shared/helpers/imageUpload";
import SubcategoryModel from "../../db/models/Subcategory";
import testeID from "../../shared/helpers/verifyId";

export const deleteSubcategory = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!testeID(id)) {
    res.status(422).json({ message: "ID inválido!" });
    return;
  }

  const Subcategory = await SubcategoryModel.findOne({ _id: id });
  if (!Subcategory) {
    res.status(404).json({ message: "Subcategoria não encontrada!" });
    return;
  }

  try {
    await SubcategoryModel.findByIdAndRemove(id);

    if (Subcategory.image)
      await removeImageS3("subcategory", Subcategory.image);

    res.status(200).json({ message: "Subcategoria removida com sucesso!" });
  } catch (error) {
    console.log("erro no delete subcategory", error);
    return res.status(500).json({
      message: "erro no delete subcategory",
      error,
    });
  }
};

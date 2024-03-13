import { Request, Response } from "express";
import Category from "../../db/models/Category";

import { removeImageS3 } from "../../shared/helpers/imageUpload";
import testeID from "../../shared/helpers/verifyId";

export const deleteCategory = async (req: Request, res: Response) => {
  const id = req.params.id;

  const isValidId = testeID(id)

  if (!isValidId) {
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
  } catch (error) {
    console.log("erro no delete category", error)
return res.status(500).json({
  message: "erro no delete category", error
})
  }
};

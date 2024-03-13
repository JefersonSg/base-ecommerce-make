import { Request, Response } from "express";

import Category from "../../db/models/Category";
import getUrlImageS3 from "../../shared/helpers/getUrlImageS3";
import testeID from "../../shared/helpers/verifyId";

export const getById = async (req: Request, res: Response) => {
  const id = req.params.id;

  const isValidId = testeID(id)

  if (!isValidId) {
    res.status(422).json({
      message: "ID inválido, Categoria não encontrada",
    });
    return;
  }

try {
  const category = await Category.findById(id);

  if (!category) {
    res.status(422).json({
      message: "Categoria não encontrada",
    });
    return;
  }
  if (!category.image) {
    return res.status(200).json({
      category,
    });
  }
  const url = await getUrlImageS3("category", category?.image);

  category.image = url;
  res.status(200).json({
    category,
  });
} catch (error) {
  console.log("erro no getById category", error)
return res.status(500).json({
  message: "erro no getById category", error
})
}
};



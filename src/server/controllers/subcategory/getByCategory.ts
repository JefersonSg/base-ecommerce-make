import { Request, Response } from "express";

import getUrlImageS3 from "../../shared/helpers/getUrlImageS3";
import SubcategoryModel from "../../db/models/Subcategory";
import testeID from "../../shared/helpers/verifyId";
import { SubcategoryInterface } from "../../shared/helpers/Interfaces";

export const getByCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  if (!testeID(categoryId)) {
    res.status(422).json({
      message: "ID inválido, Categoria não encontrada",
    });
    return;
  }

try {
  const subcategories = await SubcategoryModel.find({category: categoryId});

  if (!subcategories) {
    res.status(422).json({
      message: "nenhuma subcategoria encontrada",
    });
    return;
  }

  for (const subcategory of subcategories) {
    const url = await getUrlImageS3("subcategory", subcategory.image);

    if (!subcategory?.image) {
      return;
    }
    subcategory.image = url ?? "";
  }

  res.status(200).json(
     { subcategories},
  );
} catch (error) {
  console.log("erro no delete getByCategory", error)
  return res.status(500).json({
    message: "erro no delete getByCategory", error
  })
}
};

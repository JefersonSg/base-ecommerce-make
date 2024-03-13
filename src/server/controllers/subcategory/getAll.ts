import { Request, Response } from "express";
import getUrlImageS3 from "../../shared/helpers/getUrlImageS3";
import SubcategoryModel from "../../db/models/Subcategory";
import { SubcategoryInterface } from "../../shared/helpers/Interfaces";

export const getAll = async (req: Request, res: Response) => {
  const subcategories = await SubcategoryModel.find().sort("-createdAt");

  if (!subcategories) {
    res.status(422).json({
      message: "Nenhuma subcategoria foi encontrada",
    });
    return;
  }

  for (const subcategory of subcategories) {
    if (subcategory.image) {
      const url = await getUrlImageS3("subcategory", subcategory?.image);

      if (!subcategory?.image) {
        return;
      }
      subcategory.image = url ?? "";
    }
  }

  try {
    res.status(200).json({
      subcategories,
    });
    return;
  } catch (error) {
    console.log("erro no getAll subcategory", error);
    return res.status(500).json({
      message: "erro no getAll subcategory",
      error,
    });
  }
};

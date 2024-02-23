import { Request, Response } from "express";

import mongoose from "mongoose";
import getUrlImageS3 from "../../shared/helpers/getUrlImageS3";
import SubcategoryModel from "../../db/models/Subcategory";
const ObjectId = mongoose.Types.ObjectId;

export const getById = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    res.status(422).json({
      message: "ID inválido, Subcategoria não encontrada",
    });
    return;
  }

  const subcategory = await SubcategoryModel.findById(id);

  if (!subcategory) {
    res.status(422).json({
      message: "subcategoria não encontrada",
    });
    return;
  }

  if (!subcategory.image) return res.status(200).json({ subcategory });

  const url = await getUrlImageS3("subcategory", subcategory?.image);

  subcategory.image = url;

  res.status(200).json({
    subcategory,
  });
};

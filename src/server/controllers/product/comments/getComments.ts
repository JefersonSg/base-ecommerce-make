import { Request, Response } from "express";
import ProductModel from "../../../db/models/Product";
import mongoose from "mongoose";

export const getAllComments = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ObjectId = mongoose.Types.ObjectId;

  if (!ObjectId.isValid(id)) {
    res.status(422).json({
      message: "ID inválido, produto não encontrado",
    });
    return;
  }

  const product = await ProductModel.findOne({ _id: id });

  if (!product) {
    return res.status(400).json({
      message: "Nenhum produto encontrado com esse ID",
    });
  }

  return res.status(200).json({
    message: product.comments,
  });
};

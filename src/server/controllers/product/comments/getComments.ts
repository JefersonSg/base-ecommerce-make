import { Request, Response } from "express";
import ProductModel from "../../../db/models/Product";
import mongoose from "mongoose";
import { ProductDataBackEnd } from "../../../shared/helpers/Interfaces";
import getUrlImageS3 from "../../../shared/helpers/getUrlImageS3";

export const getAllComments = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ObjectId = mongoose.Types.ObjectId;

  if (!ObjectId.isValid(id)) {
    res.status(422).json({
      message: "ID inválido, produto não encontrado",
    });
    return;
  }

  let product = await ProductModel.findOne({ _id: id }) as ProductDataBackEnd;

  if (!product) {
    return res.status(400).json({
      message: "Nenhum produto encontrado com esse ID",
    });
  }

  for (const comment of product.comments) {
    for (let i = 0; i < comment.images.length; i++) {
      const url = await getUrlImageS3("products", product?.images[i]);

      comment.images[i] = url ?? "";
    }
  }

  return res.status(200).json({
    comments: product.comments
  });
};

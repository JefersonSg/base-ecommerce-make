import { Request, Response } from "express";
import ProductModel from "../../../db/models/Product";
import mongoose from "mongoose";
import { ProductDataBackEnd } from "../../../shared/helpers/Interfaces";
import getUrlImageS3 from "../../../shared/helpers/getUrlImageS3";
import { getUserById } from "../../user/getById";
import CommentsModel from "../../../db/models/Comments";

export const getAllComments = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const ObjectId = mongoose.Types.ObjectId;

  if (!ObjectId.isValid(productId)) {
    res.status(422).json({
      message: "ID inválido, nenhum produco encontrado com esse ID",
    });
    return;
  }

  let product = await ProductModel.findOne({ _id: productId }) as ProductDataBackEnd;

  if (!product) {
    return res.status(400).json({
      message: "Nenhum produto encontrado com esse ID",
    });
  }

  const AllComments = await CommentsModel.find({productId})


  for (const comment of AllComments) {

    for (let i = 0; i < comment?.image?.length; i++) {
      const url = await getUrlImageS3("comments", comment?.image[i]);

      comment.image[i] = url ?? "";
    }
  }

  return res.status(200).json({
    comments: AllComments
  });
};

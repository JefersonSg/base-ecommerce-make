import { Request, Response } from "express";
import Product from "../../db/models/Product";
import mongoose from "mongoose";
import getUrlImageS3 from "../../shared/helpers/getUrlImageS3";

const ObjectId = mongoose.Types.ObjectId;

export const getProductById = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    res.status(422).json({
      message: "ID inválido, produto não encontrado",
    });
    return;
  }

  const product = await Product.findById(id);

  if (!product) {
    res.status(422).json({
      message: "produto não encontrado",
    });
    return;
  }

    
    for (let i = 0; i < product.images.length; i++) {

      const url = await getUrlImageS3(product?.images[i])


      product.images[i] = url ?? ''
    }
  res.status(200).json({
    product,
  });
};

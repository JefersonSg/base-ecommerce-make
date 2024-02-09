import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../../db/models/Product";

const ObjectId = mongoose.Types.ObjectId;

export const getProductByCategory = async (req: Request, res: Response) => {
  const category = req.params.id;
  if (!ObjectId.isValid(category)) {
    res.status(422).json({
      message: "ID inválido, produto não encontrado",
    });
    return;
  }

  const products = await Product.find({ category: category });

  if (!products) {
    res.status(422).json({
      message: "Nenhum produto não encontrado",
    });
    return;
  }
  res.status(200).json({
    products,
  });
};

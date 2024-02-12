import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../../db/models/Product";
import { removeImageS3 } from "../../shared/helpers/imageUpload";

const ObjectId = mongoose.Types.ObjectId;

export const removeProductById = async (req: Request, res: Response) => {
  const id = req.params.id;

  // check if id is valid
  if (!ObjectId.isValid(id)) {
    res.status(422).json({ message: "ID inválido!" });
    return;
  }

  // check if Product exists
  const product = await Product.findOne({ _id: id });

  if (!product) {
    res.status(404).json({ message: "Produto não encontrado!" });
    return;
  }

  try {
    await Product.findByIdAndRemove(id);
    
    for (const images of product.images) {

      await removeImageS3('products', images)
    }

    res.status(200).json({ message: "Produto removido com sucesso!" });
  } catch (err) {
    console.log(err);
  }
};

import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../../db/models/Product";
import {
  removeImageS3,
  updateImageToS3,
  uploadToS3,
} from "../../shared/helpers/imageUpload";

interface ProductData {
  name: string;
  brand: string;
  price: number;
  size: string;
  category: string;
  description: string;
  composition: string;
  characteristic: string;
  colors: string[];
  codeColors: string[];
  amount: number[];
  promotion: boolean;
  active: boolean;
  promotionalPrice: number;
}

const ObjectId = mongoose.Types.ObjectId;

export const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  const productData: ProductData = req.body;

  const images: any = req.files;

  const updateData: ProductData | any = {};
  // check if ID exists

  if (!ObjectId.isValid(id)) {
    res.status(422).json({
      message: "ID inválido, produto não encontrado",
    });
    return;
  }
  // check if Product exists

  const product = await Product.findOne({ _id: id });

  if (!product) {
    res.status(404).json({ message: "Produto não encontrado!" });
    return;
  }

  // validations

  updateData.name = productData.name;
  updateData.brand = productData.brand;
  updateData.category = productData.category;
  updateData.description = productData.description;
  updateData.price = productData.price;
  updateData.colors = productData.colors;
  updateData.codeColors = productData.codeColors;
  updateData.composition = productData.composition;
  updateData.characteristic = productData.characteristic;
  const stock = {
    amount: productData.amount ?? [0]
  };
  updateData.stock = stock;
  updateData.promotion = productData.promotion;

  if (productData.promotionalPrice) {
    updateData.promotionalPrice = productData.promotionalPrice;
  }

  if (images?.length) {
    async function uploads() {
      
      // Use `map` with `Promise.all` to await for all uploads to complete
      await Promise.all(
        images?.map(async (image: any, index: number) => {
          const data = await uploadToS3(image);
          image.filename = data;
        }),
      );
    }

    updateData.images = [];

    await uploads();
    images.map((image: any) => {
      updateData.images.push(image.filename);
    });
  }

  // delete Old Images
  product.images.forEach((image) => {
    removeImageS3(image);
  });
  await Product.findByIdAndUpdate(id, updateData);

  res
    .status(200)
    .json({ updateData, message: "Produto atualizado com sucesso!" });
};
import { type Request, type Response } from "express";
import Product from "../../db/models/Product";
import { removeImageS3, uploadToS3 } from "../../shared/helpers/imageUpload";
import { type ProductDataFrontEnd } from "../../shared/helpers/Interfaces";
import testeID from "../../shared/helpers/verifyId";
import { verifySizeImage } from "../../shared/helpers/verifySize";
import { verifyMimetypeImage } from "../../shared/helpers/verifyMimetype";

export const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  const productData: ProductDataFrontEnd = req.body;

  const images: any = req.files;

  const updateData: ProductDataFrontEnd | any = {};
  // check if ID exists

  async function uploads(images: string[], oldImages: string[]) {
    // Use `map` with `Promise.all` to await for all uploads to complete
    const newImages = await Promise.all(
      images?.map(async (image: any) => {
        const data = await uploadToS3("products", image);
        return data;
      }),
    );

    if (oldImages.length > 0) {
      oldImages?.forEach((image) => {
        void removeImageS3("products", image);
      });
    }

    return newImages;
  }

  try {
    const isValidId = testeID(id);
    if (!isValidId) {
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
    updateData.subcategory = productData.subcategory
      ? productData.subcategory
      : null;
    updateData.description = productData.description;
    updateData.price = productData.price;
    updateData.size = productData.size;
    updateData.colors = productData?.colors?.split(",") ?? "";
    updateData.codeColors = productData?.codeColors?.split(",") ?? "";
    updateData.composition = productData.composition;
    updateData.characteristic = productData.characteristic;
    updateData.howToUse = productData.howToUse;
    updateData.active = productData.active;
    const stock = {
      amount: productData.amount.split(",").map((amount) => {
        return +amount;
      }),
    };
    updateData.stock = stock;
    updateData.promotion = productData.promotion;
    updateData.promotionalPrice =
      productData.promotionalPrice ?? product.promotionalPrice ?? 0;

    if (images?.length > 0) {
      if (verifySizeImage(images)) {
        return res.status(401).json({
          message: verifySizeImage(images),
        });
      }

      if (verifyMimetypeImage(images)) {
        return res.status(401).json({
          message: verifyMimetypeImage(images),
        });
      }

      updateData.images = [];

      const newImages = await uploads(images, product?.images);

      newImages.map((image: any) => {
        return updateData.images.push(image);
      });
    }

    await Product.findByIdAndUpdate(id, updateData);

    return res
      .status(200)
      .json({ updateData, message: "Produto atualizado com sucesso!" });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "erro ao fazer update",
      error,
    });
  }
};

import { Request, Response } from "express";
import { uploadToS3 } from "../../shared/helpers/imageUpload";
import Product from "../../db/models/Product";
import { ProductDataFrontEnd } from "../../shared/helpers/Interfaces";
import { verifySizeImage } from "../../shared/helpers/verifySize";
import { verifyMimetypeImage } from "../../shared/helpers/verifyMimetype";

export const create = async (req: Request, res: Response) => {
  const productData: ProductDataFrontEnd = req.body;
  const images: any = req.files;

  const stock = {
    amount: productData.amount.split(",").map((amount) => {
      return +amount;
    }),
  };

  if (images && images.length === 0) {
    res.status(422).json({
      message: "A imagem é obrigatoria",
    });
    return;
  }
  if (verifySizeImage(images)) {
    return res.status(401).json({
      message : verifySizeImage(images)
    })
  }

  if (verifyMimetypeImage(images)) {
    return res.status(401).json({
      message : verifyMimetypeImage(images)
    })
  }
  async function uploads() {
    // Use `map` with `Promise.all` to wait for all uploads to complete
    await Promise.all(
      images?.map(async (image: any) => {
        const Image = await uploadToS3("products", image);
        image.filename = Image;
      }),
    );
  }

  // create Product
  const product = new Product({
    name: productData.name,
    brand: productData.brand,
    price: productData.price,
    category: productData.category,
    subcategory: productData.subcategory,
    description: productData.description,
    colors: productData.colors.split(","),
    codeColors: productData.codeColors.split(","),
    composition: productData.composition,
    size: productData.size,
    characteristic: productData.characteristic,
    stock: stock,
    images: [],
    promotion: productData.promotion,
    promotionalPrice: productData.promotionalPrice,
    active: productData.active,
  });

  await uploads();

  images?.map((image: any) => {
    product.images.push(image.filename);
  });

  try {
    const newProduct = await product.save();
    res.status(200).json({
      message: "Produco criado com sucesso",
      newProduct,
    });
  } catch (error) {
    console.log("erro ao criar produto", error);
    return res.status(500).json({ message: error });
  }
};

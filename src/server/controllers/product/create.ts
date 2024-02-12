import { Request, Response } from "express";
import { uploadToS3 } from "../../shared/helpers/imageUpload";
import Product from "../../db/models/Product";

interface ProductData {
  name: string;
  brand: string;
  price: number;
  size: string;
  category: string;
  subcategory: string;
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

export const create = async (req: Request, res: Response) => {
  const productData: ProductData = req.body;
  const images: any = req.files;

  // generate a const stock with all infos products/

  const stock = {
      amount: productData.amount ?? [0],
  };

  if (images && images.length === 0) {
    res.status(422).json({
      message: "A imagem é obrigatoria",
    });
    return;
  }

  async function uploads() {
    // Use `map` with `Promise.all` to wait for all uploads to complete
    await Promise.all(
      images?.map(async (image: any) => {
        const Image = await uploadToS3( 'products', image);
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
    codeColors: productData.codeColors,
    composition: productData.composition,
    size: productData.size,
    colors: productData.colors,
    characteristic: productData.characteristic,
    stock: stock,
    images: [],
    promotion: productData.promotion,
    promotionalPrice: productData.promotionalPrice,
    active: productData.active
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
    res.status(500).json({ message: error });
  }
};

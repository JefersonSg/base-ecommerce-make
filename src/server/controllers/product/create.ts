import { type Request, type Response } from 'express';
import { uploadToS3 } from '../../shared/helpers/imageUpload';
import Product from '../../db/models/Product';
import { type ProductDataFrontEnd } from '../../shared/helpers/Interfaces';
import { verifySizeImage } from '../../shared/helpers/verifySize';
import { verifyMimetypeImage } from '../../shared/helpers/verifyMimetype';

export const create = async (req: Request, res: Response) => {
  const productData: ProductDataFrontEnd = req.body;
  const images: any = req?.files;

  const stock = {
    amount: JSON?.parse(productData?.amount)
  };
  let coverPhoto1 = '';
  let coverPhoto2 = '';

  if (images?.coverPhoto1?.[0]) {
    if (verifySizeImage(images?.coverPhoto1)) {
      return res.status(401).json({
        error: verifySizeImage(images?.coverPhoto1)
      });
    }

    if (verifyMimetypeImage(images?.coverPhoto1)) {
      return res.status(401).json({
        error: verifyMimetypeImage(images?.coverPhoto1)
      });
    }
  }
  if (images?.coverPhoto2?.[0]) {
    if (verifySizeImage(images?.coverPhoto2)) {
      return res.status(401).json({
        error: verifySizeImage(images?.coverPhoto2)
      });
    }

    if (verifyMimetypeImage(images?.coverPhoto2)) {
      return res.status(401).json({
        error: verifyMimetypeImage(images?.coverPhoto2)
      });
    }
  }

  if (images && images.length === 0) {
    res.status(422).json({
      error: 'A imagem é obrigatoria'
    });
    return;
  }

  if (verifySizeImage(images)) {
    return res.status(401).json({
      error: verifySizeImage(images)
    });
  }

  if (verifyMimetypeImage(images)) {
    return res.status(401).json({
      error: verifyMimetypeImage(images)
    });
  }

  if (images.coverPhoto1?.[0]) {
    const convertPhoto = await uploadToS3('products', images.coverPhoto1[0]);

    coverPhoto1 = convertPhoto || '';
  }

  if (images.coverPhoto2?.[0]) {
    const convertPhoto = await uploadToS3('products', images?.coverPhoto2[0]);
    coverPhoto2 = convertPhoto || '';
  }

  async function uploads() {
    // Use `map` with `Promise.all` to wait for all uploads to complete
    await Promise.all(
      images?.images?.map(async (image: any) => {
        const Image = await uploadToS3('products', image);
        image.filename = Image;
      })
    );
  }

  // create Product
  const product = new Product({
    name: productData.name,
    brand: productData.brand,
    price: productData.price,
    category: productData.category,
    subcategory: productData?.subcategory?.length
      ? productData?.subcategory
      : undefined,
    description: productData.description,
    colors: productData?.colors?.split(','),
    codeColors: productData?.codeColors?.split(','),
    composition: productData.composition,
    howToUse: productData.howToUse,
    size: productData?.size?.split(','),
    characteristic: productData.characteristic,
    stock,
    images: [],
    coverPhoto1,
    coverPhoto2,
    promotion: productData.promotion,
    promotionalPrice: productData.promotionalPrice,
    active: productData.active
  });

  await uploads();

  images?.images?.map((image: any) => {
    return product.images.push(image.filename);
  });

  try {
    const newProduct = await product.save();
    res.status(200).json({
      message: 'Produco criado com sucesso',
      newProduct
    });
  } catch (error) {
    console.log('erro ao criar produto', error);
    return res.status(500).json({ error });
  }
};

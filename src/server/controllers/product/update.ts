import { type Request, type Response } from 'express';
import Product from '../../db/models/Product';
import { removeImageS3, uploadToS3 } from '../../shared/helpers/imageUpload';
import { type ProductDataFrontEnd } from '../../shared/helpers/Interfaces';
import testeID from '../../shared/helpers/verifyId';
import { verifySizeImage } from '../../shared/helpers/verifySize';
import { verifyMimetypeImage } from '../../shared/helpers/verifyMimetype';

export const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  const productData: ProductDataFrontEnd = req.body;

  let coverPhoto1 = '';
  let coverPhoto2 = '';

  const images: any = req.files;

  const updateData: ProductDataFrontEnd | any = {};
  // check if ID exists

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

  if (images?.coverPhoto1?.[0]) {
    const convertPhoto = await uploadToS3('products', images?.coverPhoto1?.[0]);

    coverPhoto1 = convertPhoto || '';
    void removeImageS3('products', productData.coverPhoto1);
  }

  if (images?.coverPhoto2?.[0]) {
    const convertPhoto = await uploadToS3('products', images?.coverPhoto2?.[0]);
    coverPhoto2 = convertPhoto || '';
    void removeImageS3('products', productData?.coverPhoto1);
  }

  async function uploads(images: any, oldImages: string[]) {
    const newImages = await Promise.all(
      images?.images?.map(async (image: any) => {
        const data = await uploadToS3('products', image);
        return data;
      })
    );

    if (oldImages.length > 0) {
      oldImages?.forEach((image) => {
        void removeImageS3('products', image);
      });
    }

    return newImages;
  }

  try {
    const isValidId = testeID(id);
    if (!isValidId) {
      res.status(422).json({
        message: 'ID inválido, produto não encontrado'
      });
      return;
    }

    // check if Product exists

    const product = await Product.findOne({ _id: id });

    if (!product) {
      res.status(404).json({ message: 'Produto não encontrado!' });
      return;
    }

    // validations

    updateData.name = productData.name;
    updateData.brand = productData.brand;
    updateData.category = productData.category;
    updateData.subcategory =
      productData?.subcategory && productData.subcategory.length > 5
        ? productData.subcategory
        : null;
    updateData.description = productData.description;
    updateData.price = productData.price;
    updateData.size = productData.size.split(',') ?? '';
    updateData.colors = productData?.colors?.split(',') ?? '';
    updateData.codeColors = productData?.codeColors?.split(',') ?? '';
    updateData.composition = productData.composition;
    updateData.characteristic = productData.characteristic;
    updateData.howToUse = productData.howToUse;
    updateData.active = productData.active;
    const stock = {
      amount: JSON.parse(productData.amount)
    };
    updateData.stock = stock;
    updateData.promotion = productData.promotion;
    updateData.promotionalPrice =
      productData.promotionalPrice ?? product.promotionalPrice ?? 0;
    if (images?.coverPhoto1?.[0]) {
      updateData.coverPhoto1 = coverPhoto1;
    }

    if (images?.coverPhoto2?.[0]) {
      updateData.coverPhoto2 = coverPhoto2;
    }

    if (images?.images?.length > 0) {
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

      updateData.images = [];

      const newImages = await uploads(images, product?.images);

      newImages.map((image: any) => {
        return updateData?.images.push(image);
      });
    }

    await Product.findByIdAndUpdate(id, updateData);

    return res
      .status(200)
      .json({ updateData, message: 'Produto atualizado com sucesso!' });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: 'erro ao fazer update',
      error
    });
  }
};

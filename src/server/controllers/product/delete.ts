import { type Request, type Response } from 'express';
import Product from '../../db/models/Product';
import { removeImageS3 } from '../../shared/helpers/imageUpload';
import testeID from '../../shared/helpers/verifyId';

export const removeProductById = async (req: Request, res: Response) => {
  const id = req.params.id;

  // check if id is valid
  const isValidId = testeID(id);

  if (!isValidId) {
    res.status(422).json({ message: 'ID inválido!' });
    return;
  }

  // check if Product exists
  const product = await Product.findOne({ _id: id });

  if (!product) {
    res.status(404).json({ message: 'Produto não encontrado!' });
    return;
  }

  try {
    await Product.findByIdAndRemove(id);

    if (product?.coverPhoto1) {
      await removeImageS3('products', product.coverPhoto1);
    }
    if (product?.coverPhoto2) {
      await removeImageS3('products', product.coverPhoto2);
    }

    for (const images of product.images) {
      await removeImageS3('products', images);
    }

    res.status(200).json({ message: 'Produto removido com sucesso!' });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: 'erro no delete category',
      error
    });
  }
};

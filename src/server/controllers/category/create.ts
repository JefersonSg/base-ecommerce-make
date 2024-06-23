import { type Request, type Response } from 'express';
import { uploadToS3 } from '../../shared/helpers/imageUpload';
import Category from '../../db/models/Category';
import { verifySizeImage } from '../../shared/helpers/verifySize';
import { verifyMimetypeImage } from '../../shared/helpers/verifyMimetype';

export const createCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const image: any = req.file;

  if (image && image?.length === 0) {
    res.status(422).json({
      message: 'A imagem é obrigatoria'
    });
    return;
  }

  if (verifySizeImage(image)) {
    return res.status(401).json({
      message: verifySizeImage(image)
    });
  }

  if (verifyMimetypeImage(image)) {
    return res.status(401).json({
      message: verifyMimetypeImage(image)
    });
  }

  const imageUpload = await uploadToS3('category', image);

  if (!imageUpload) {
    return res.status(404).send({
      message: 'erro ao enviar imagem'
    });
  }

  // create Category
  const category = new Category({
    name,
    description,
    image: imageUpload
  });

  try {
    const newCategory = await category.save();
    res.status(200).json({
      message: 'Categoria criada com sucesso',
      newCategory
    });
  } catch (error) {
    console.log('erro no create category', error);
    return res.status(500).json({
      message: 'erro no create category',
      error
    });
  }
};

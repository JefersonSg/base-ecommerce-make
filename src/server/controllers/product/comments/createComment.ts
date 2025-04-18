import { type Request, type Response } from 'express';
import ProductModel from '../../../db/models/Product';
import { type ProductDataBackEnd } from '../../../shared/helpers/Interfaces';
import { uploadToS3 } from '../../../shared/helpers/imageUpload';
import CommentsModel from '../../../db/models/Comments';
import testeID from '../../../shared/helpers/verifyId';

export const createComment = async (req: Request, res: Response) => {
  const { userId, comment, stars, productId } = req.body;
  const image: any = req.file;

  if (!stars || !userId) {
    return res.status(400).json({
      message: 'insira as informações do comentario'
    });
  }
  const isValidId = testeID(productId);

  if (!isValidId) {
    res.status(422).json({
      message: 'ID inválido, produto não encontrado'
    });
    return;
  }
  const product = (await ProductModel.findOne({
    _id: productId
  })) as ProductDataBackEnd;

  if (!product) {
    return res.status(400).json({
      message: 'Nenhum produto encontrado com esse ID'
    });
  }
  const alreadyCommented = await CommentsModel.find({ userId, productId });

  if (alreadyCommented[0]) {
    return res.status(401).json({
      message: 'Usuário ja possui um comentário neste produto'
    });
  }

  console.log(image);
  const imageUpload = image ? await uploadToS3('comments', image) : '';

  const commentData = new CommentsModel({
    productId,
    userId,
    comment,
    stars,
    image: imageUpload ? [imageUpload] : []
  });

  try {
    const newComment = await commentData.save();
    return res.status(200).json({
      message: 'commentario inserido com sucesso',
      newComment
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: 'erro no no comment create',
      error
    });
  }
};

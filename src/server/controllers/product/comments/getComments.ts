import { type Request, type Response } from 'express';
import ProductModel from '../../../db/models/Product';
import { type ProductDataBackEnd } from '../../../shared/helpers/Interfaces';
import getUrlImageS3 from '../../../shared/helpers/getUrlImageS3';
import CommentsModel from '../../../db/models/Comments';
import testeID from '../../../shared/helpers/verifyId';

export const getAllComments = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const isValidId = testeID(productId);

  if (!isValidId) {
    res.status(422).json({
      message: 'ID inválido, nenhum produco encontrado com esse ID'
    });
    return;
  }

  try {
    const product = (await ProductModel.findOne({
      _id: productId
    })) as ProductDataBackEnd;

    if (!product) {
      return res.status(400).json({
        message: 'Nenhum produto encontrado com esse ID'
      });
    }

    const AllComments = await CommentsModel.find({ productId });

    for (const comment of AllComments) {
      for (let i = 0; i < comment?.image?.length; i++) {
        const url =
          comment.image[i] &&
          (await getUrlImageS3('comments', comment?.image[i]));

        comment.image[i] = url ?? '';
      }
    }

    return res.status(200).json({
      comments: AllComments
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: 'erro no getComment',
      error
    });
  }
};

import { type Request, type Response } from 'express';
import FavoriteModel from '../../db/models/Favorite';

export const create = async (req: Request, res: Response) => {
  const { userId, productId } = req.body;
  const oldFavorite = await FavoriteModel.find({ userId, productId });

  if (oldFavorite[0]) {
    return res.status(409).json({
      message: 'Favorito ja adicionado no sistema'
    });
  }

  const Favorite = new FavoriteModel({
    userId,
    productId
  });

  try {
    const newFavorite = await Favorite.save();
    return res.status(200).json({
      message: 'Favorito salvo com sucesso',
      newFavorite
    });
  } catch (error) {
    console.log('erro no create favorite', error);
    return res.status(500).json({
      message: 'erro no create favorite',
      error
    });
  }
};

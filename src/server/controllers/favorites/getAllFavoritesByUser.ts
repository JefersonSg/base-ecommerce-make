import { Request, Response } from "express";
import FavoriteModel from "../../db/models/Favorite";


export const getAllFavoritesUser = async (req: Request, res: Response) => {
  const { userId } = req.params

  const favorites = await FavoriteModel.find({userId: userId});

  try {
    res.status(200).json({
      favorites,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
};

import { Request, Response } from "express";
import ViewsSchema from "../../../db/models/Views";

export const create = async (req: Request, res: Response) => {
  const {userId, productId} = req.body;

  const oldFavorite = await ViewsSchema.find({userId , productId})
  
  if(oldFavorite[0]) {
    return res.status(409).json({
      message: 'Favorito ja adicionado no sistema'
    })
  }


const Favorite = new ViewsSchema(
    {
      userId,
      productId,
    }
  );

  try {
    const newFavorite = await Favorite.save();
    return res.status(200).json({
      message: "Favorito salvo com sucesso",
      newFavorite,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

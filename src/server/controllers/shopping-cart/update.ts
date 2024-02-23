import { Request, Response } from "express";
import ShoppingCart from "../../db/models/ShoppingCart";


export const update = async (req: Request, res: Response) => {
  const { userId } = req.params
  const {id} = req.body
  const shoppingCart = await ShoppingCart.findOneAndUpdate(
    {userId: userId, _id: id}, {$push : {status: 'fechado'}});

  try {
    res.status(200).json({
      message: 'atulizado com sucesso: ' + shoppingCart,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
};

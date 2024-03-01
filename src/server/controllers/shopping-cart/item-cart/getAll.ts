import { Request, Response } from "express";
import ShoppingCart from "../../../db/models/ShoppingCart";
import ItemCart from "../../../db/models/ItemCart";

export const getAllItemsCart = async (req: Request, res: Response) => {
  const { userId } = req.params

  const shoppingCart = await ShoppingCart.findOne({ userId, status: 'aberto' })

  if (!shoppingCart) {
    res.status(200).json({
      message: 'nenhum item no carrinho / Carrinho não criado'
    });
    return;
  }
  
  const itemsCarts = await ItemCart.find({shoppingCartId: shoppingCart._id})

  if (!itemsCarts) {
    res.status(404).json({
      message: 'nenhum item encontrado no carrinho'
    });
    return;
  }
  
  try {
    return res.status(200).json({
       itemsCarts,
    });
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
};

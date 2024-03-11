import { Request, Response } from "express";
import ItemCart from "../../../db/models/ItemCart";
import { itemCart } from "../../../shared/helpers/Interfaces";


export const updateItemCart = async (req: Request, res: Response) => {
  const { itemId } = req.params
  const {color, amount, size} = req.body
  const ItemShoppingCart = await ItemCart.findById(itemId) as itemCart;



  if (!ItemShoppingCart) {
    res.status(404).json({
      message: 'nenhum item encontrado'
    });
    return;
  }
  const newItem  = {
    shoppingCartId: ItemShoppingCart.shoppingCartId,
    productId: ItemShoppingCart.productId,
    color: color ?? ItemShoppingCart.color,
    amount: amount ?? ItemShoppingCart.amount,
    size: size ?? ItemShoppingCart.size
  }

  try {
    const newItemCart = await ItemCart.findByIdAndUpdate(itemId, newItem)

    return res.status(200).json({
      message: 'atulizado com sucesso: ' , newItemCart,
    });
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
};
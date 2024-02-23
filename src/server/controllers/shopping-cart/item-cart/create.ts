import { Request, Response } from "express";
import ShoppingCart from "../../../db/models/ShoppingCart";
import ItemCart from "../../../db/models/ItemCart";

export const addNewItemCart = async (req: Request, res: Response) => {
  const { userId, productId, color, amount, size } = req.body;

  try {
    let shoppingCart = await ShoppingCart.findOne({ userId, status: 'aberto' });

    if (!shoppingCart) {
      shoppingCart = await new ShoppingCart({
        userId,
        status: 'aberto',
      }).save();
    }

    let checkItemCart = await ItemCart.findOne({ shoppingCartId : shoppingCart._id, productId, color, size})

    if (checkItemCart) {
      checkItemCart.amount = checkItemCart.amount + 1

      const newItemCart = await ItemCart.findByIdAndUpdate(checkItemCart?._id, checkItemCart)
      return res.status(200).json({
        message: "Adicionou +1 ao amount", newItemCart
      })
    }


    const itemCart = await new ItemCart({
      shoppingCartId: shoppingCart._id,
      productId,
      color,
      amount,
      size
    }).save();

    return res.status(200).json({ message: "Item adicionado ao carrinho com sucesso", itemCart});
  } catch (error) {
    console.error("Erro ao adicionar item ao carrinho:", error);
    return res.status(500).json({ error: "Ocorreu um erro ao processar a solicitação" });
  }
};

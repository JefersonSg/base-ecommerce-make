import { Request, Response } from "express";
import ItemCart from "../../../db/models/ItemCart";
import { ProductDataBackEnd, itemCart } from "../../../shared/helpers/Interfaces";
import Product from "../../../db/models/Product";
import { removeItemCartById } from "./removeById";

export const updateItemCart = async (req: Request, res: Response) => {
  const { itemId } = req.params;
  const { color, amount, size } = req.body;
  const ItemShoppingCart = (await ItemCart.findById(itemId)) as itemCart;
  

  if (!ItemShoppingCart) {
    res.status(404).json({
      message: "nenhum item encontrado",
    });
    return;
  }
  const product = await Product.findById(ItemShoppingCart?.productId) as ProductDataBackEnd

  if (!product) {
    return res.status(404).json({
      message: 'Erro ao procurar pelo produto'
    })
  }

  const colorIndex = product.colors.indexOf(color)
  const sizeIndex = product.size.indexOf(size)

  if (colorIndex < 0 || sizeIndex < 0) {
     res.status(400).json({
      message: 'Erro ao atualizar o produto, está cor não está disponivel'
    })

    await ItemCart.findByIdAndDelete(itemId)
    return
  }
  if (Number(amount) < 1) {
    res.status(404).json({
      message: "o item não pode ser menor do que zero",
    });
    return;
  }
  if (Number(amount) > product.stock.amount[colorIndex]) {
    res.status(404).json({
      message: "Limite alcançado",
    });
    return;
  }
  const newItem = {
    shoppingCartId: ItemShoppingCart.shoppingCartId,
    productId: ItemShoppingCart.productId,
    color: color ?? ItemShoppingCart.color,
    amount: amount ?? ItemShoppingCart.amount,
    size: size ?? ItemShoppingCart.size,
  };

  try {
    const newItemCart = await ItemCart.findByIdAndUpdate(itemId, newItem);

    return res.status(200).json({
      message: "atulizado com sucesso: ",
      newItemCart,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "erro no update item-cart",
      error,
    });
  }
};

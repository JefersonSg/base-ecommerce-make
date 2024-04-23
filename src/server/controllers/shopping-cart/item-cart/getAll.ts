import { Request, Response } from "express";
import ShoppingCart from "../../../db/models/ShoppingCart";
import ItemCart from "../../../db/models/ItemCart";
import Product from "../../../db/models/Product";
import { calculateDeliveryFunc } from "../../../shared/helpers/calculateDeliveryFunc";
import { ItemsCartInterface } from "../../../shared/helpers/Interfaces";



export const getAllItemsCart = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const {cep} = req.body

  const shoppingCart = await ShoppingCart.findOne({ userId, status: "aberto" });

  if (!shoppingCart) {
    res.status(200).json({
      message: "nenhum item no carrinho / Carrinho não criado",
    });
    return;
  }

  const itemsCart = await ItemCart.find({ shoppingCartId: shoppingCart._id }) as unknown as ItemsCartInterface[];

  if (!itemsCart) {
    res.status(404).json({
      message: "nenhum item encontrado no carrinho",
    });
    return;
  }

  const values : any[] | null = await Promise.all( itemsCart.map( async (item)=>{
    const productPrice = await Product.findOne({_id: item.productId})

    if (productPrice) {
      const colorIndex = productPrice.colors.indexOf(item.color)
      const sizeIndex = productPrice.size.indexOf(item.size)

      if (colorIndex < 0 || sizeIndex < 0) {
         const itemRemovido = await ItemCart.findByIdAndRemove(item._id)

         return null
      }
      if (productPrice.promotion && productPrice.promotionalPrice) {
        return  +productPrice.promotionalPrice
      }
      return  +productPrice.price
    }

    return null
  }))

  const actualValue = values.map((value, index)=> itemsCart[index].amount * value)

  const entrega = await calculateDeliveryFunc(cep, itemsCart, actualValue)


  const totalValue = actualValue.reduce((i : number, value) => i + value, 0);

  try {
    return res.status(200).json({
      itemsCart, prices : actualValue, totalValue, shippingOptions: entrega
    });
  } catch (error) {
    res.status(500).json({ message: error });
    return;
  }
};

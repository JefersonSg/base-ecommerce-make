import { Request, Response } from "express";

import ShoppingCart from "../../db/models/ShoppingCart";
import ItemCart from "../../db/models/ItemCart";
import Product from "../../db/models/Product";
import { ProductDataBackEnd } from "../../shared/helpers/Interfaces";

export const createOrder = async (req: Request, res: Response) =>{
    const { userId } = req.params;

    const { cupom } = req.body

    let itemNoStock : any = []

    if (!userId) {
        return res.status(400).json({
            message: 'É necessário o id do usuário'
        })
    }

    const shoppingCart = await ShoppingCart.findOne({ userId, status: "aberto" });
  
    if (!shoppingCart) {
      res.status(200).json({
        message: "nenhum item no carrinho / Carrinho não criado",
      });
      return;
    }
  
    const itemsCart = await ItemCart.find({ shoppingCartId: shoppingCart._id });
  
    if (!itemsCart) {
      res.status(404).json({
        message: "nenhum item encontrado no carrinho",
      });
      return;
    }
  
    const produtos = {
        'produtosIds': [],
        'preçosPagos': [],
    }

    const values : any[] | null = await Promise.all( itemsCart.map( async (item)=>{
      const productPrice = await Product.findOne({_id: item.productId}) as ProductDataBackEnd
  
      if (+productPrice?.stock?.amount <= 0) {
        itemNoStock = productPrice
      }
  
      if (productPrice) {
        const colorIndex = productPrice.colors.indexOf(item.color)
        const sizeIndex = productPrice.size.indexOf(item.size)
  
        if (colorIndex < 0 || sizeIndex < 0) {
           await ItemCart.findByIdAndRemove(item._id)
            itemNoStock = productPrice
           return null
        }
        if (productPrice.promotion && productPrice.promotionalPrice) {
            // produtos.push(productPrice)
          return  +productPrice.promotionalPrice
        }
        // produtos.push(productPrice)
        return  +productPrice.price
      }
  
      return null
    }))
    

    if (itemNoStock?.[0]) {
        return res.status(401).json({
            message: 'O pedido não pode ser finalzado pois o ha um item sem estoque', itemNoStock
        })
    }
    const actualValue = values.map((value, index)=> itemsCart[index].amount * value)
  
    const totalValue = actualValue.reduce((i : number, value) => i + value, 0);


    console.log(produtos)

    return res.status(200).json({
        message: 'Pedido criado com sucesso'
    })
}

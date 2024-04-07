import { Request, Response } from "express";

import ShoppingCart from "../../db/models/ShoppingCart";
import ItemCart from "../../db/models/ItemCart";
import Product from "../../db/models/Product";
import { ProductDataBackEnd } from "../../shared/helpers/Interfaces";
import Orders from "../../db/models/Orders";
import AddressModel from "../../db/models/Address";

export const createOrder = async (req: Request, res: Response) =>{
    const { userId } = req.params;

    const { cupom, methodPayment } = req.body

    let itemNoStock : any = []

    if (!userId) {
        return res.status(400).json({
            message: 'É necessário o id do usuário'
        })
    }
    if (!methodPayment) {
      return res.status(400).json({
          message: 'É necessário preencher o Metodo de pagamento'
      })
  }
    try {
    const address = await AddressModel.findOne({userId})

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
  
    const produtosId: string[] = []
    const produtosCores: string[] = []
    const produtosQuantidade: number[] = []
    const produtosValores: number[] = []

    const values : any[] | null = await Promise.all( itemsCart.map( async (item)=>{
      const productPrice = await Product.findOne({_id: item.productId}) as ProductDataBackEnd & {
        _id: string
      }
  
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
            produtosId.push(productPrice._id)
            produtosCores.push(item.color)
            produtosQuantidade.push(+item.amount)

            produtosValores.push(+productPrice.promotionalPrice)

          return  +productPrice.promotionalPrice
        }
        produtosId.push(productPrice._id)
        produtosCores.push(item.color)
        produtosQuantidade.push(+item.amount)
        produtosValores.push(+productPrice.price)

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

    const newOrder = new Orders({
      address: address,
      userId,
      methodPayment,
      status: 'Pendente',
      productIds: produtosId,
      productAmounts: produtosQuantidade,
      productColors: produtosCores,
      valueProducts: produtosValores,
      orderTracking: '',
      totalPayment: totalValue,
      discount: 0,
    })
    const createOrder = await newOrder.save()

    // Update amount
    for (let i = 0; i < itemsCart.length; i++) {
      const item = itemsCart[i];

      const productPrice = await Product.findOne({_id: item.productId}) as ProductDataBackEnd & {
        _id: string
      }

      const indexColor = productPrice.colors.indexOf(item.color)

      let newAmount = [...productPrice.stock.amount]

      if (newAmount[indexColor] < item.amount) {
        return res.status(404).json({
          message: 'Estoque insuficiente'
        })
      }

      newAmount[indexColor] = newAmount[indexColor] - item.amount

      const options = { new: true, runValidators: true };
      const update = await Product.findByIdAndUpdate(
        item.productId, 
      { $set: { 'stock.amount': newAmount , sales: productPrice.sales + item.amount}}, options
  );

    }

    // Removendo os itens do carrinho
    for (let i = 0; i < itemsCart.length; i++) {
      const item = itemsCart[i];

      try {
        await ItemCart.findByIdAndDelete(item._id)
      } catch (error) {
        
         console.log('erro ao deletar item do carrinho', error)
      }
    }


    return res.status(200).json({
      message: 'Pedido criado com sucesso', createOrder
  })
    } catch (error) {
      res.status(
        400
      ).json({
        message: 'Erro ao criar o pedido', error
      })
    }

}

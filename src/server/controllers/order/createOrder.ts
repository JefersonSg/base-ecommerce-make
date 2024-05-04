import { Request, Response } from "express";

import ShoppingCart from "../../db/models/ShoppingCart";
import ItemCart from "../../db/models/ItemCart";
import Product from "../../db/models/Product";
import { AddressInterface, ItemsCartInterface, ProductDataBackEnd, delivery } from "../../shared/helpers/Interfaces";
import Orders from "../../db/models/Orders";
import AddressModel from "../../db/models/Address";
import { calculateDeliveryFunc } from "../../shared/helpers/calculateDeliveryFunc";
import { Payment } from "../payment/methods/payment";
import { v4 as uuidv4 } from 'uuid';

export const createOrder = async (req: Request, res: Response) =>{
    const { userId } = req.params;

    const { cupom, methodPayment, serviceShippingId } = req.body

    let itemNoStock : any = []

    if (!userId) {
        return res.status(400).json({
            message: 'É necessário o id do usuário'
        })
    }
    
    if (!methodPayment) {
      return res.status(400).json({
          message: 'É necessário preencher o Método de pagamento'
      })
      
  }
  if (!serviceShippingId) {
    return res.status(400).json({
        message: 'É necessário preencher o Método de envio'
    })
    
}


    try {
    const address = await AddressModel.findOne({userId}) as AddressInterface

    const shoppingCart = await ShoppingCart.findOne({ userId, status: "aberto" });
  
    if (!shoppingCart) {
      res.status(200).json({
        message: "nenhum item no carrinho / Carrinho não criado",
      });
      return;
    }
  
    const itemsCart = await ItemCart.find({ shoppingCartId: shoppingCart._id }) as ItemsCartInterface[];
  
    if (!itemsCart[0]) {
      res.status(404).json({
        message: "nenhum item encontrado no carrinho",
      });
      return;
    }
  
    const produtosId: string[] = []
    const produtosNames: string[] = []
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
        const colorIndex = productPrice.colors.indexOf(item?.color ?? '')
        const sizeIndex = productPrice.size.indexOf(item.size)
  
        if (colorIndex < 0 || sizeIndex < 0) {
           await ItemCart.findByIdAndRemove(item._id)
            itemNoStock = productPrice
           return null
        }
        if (productPrice.promotion && productPrice.promotionalPrice) {
            produtosId.push(productPrice._id)
            produtosCores.push(item?.color ?? '')
            produtosQuantidade.push(+item.amount)
            produtosNames.push(productPrice.name)
            produtosValores.push(+productPrice.promotionalPrice)

          return  +productPrice.promotionalPrice
        }
        produtosId.push(productPrice._id)
        produtosCores.push(item?.color ?? '')
        produtosQuantidade.push(+item.amount)
        produtosValores.push(+productPrice.price)
        produtosNames.push(productPrice.name)


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

    const shippingOrder = await calculateDeliveryFunc(address.cep, itemsCart, actualValue, serviceShippingId) as delivery

    if (!shippingOrder.price) {
      return res.status(400).json({
        error: 'Erro ao buscar o valor do frete selecionado'
      })
    }
    const totalValue = actualValue.reduce((i : number, value) => i + value, 0);

    const allItemsToPayment = itemsCart.map((item, index)=>{
      return {
        id: item.productId.toString(),
        title: produtosNames[index],
        quantity: item.amount,
        unit_price: produtosValores[index]
      }
    })

    const fretePayment = {
      id: `${shippingOrder.id}`,
      title: shippingOrder.company.name,
      quantity: 1,
      unit_price: Number(shippingOrder.price)
    }
    const paymentId = uuidv4();

    const payment = await Payment(allItemsToPayment, fretePayment, paymentId)
    

    if (!payment) {
      return res.status(500).json({
        error: 'Erro ao gerar o pagamento do pedido'
      })
    }

    console.log(payment)


    const newOrder = new Orders({
      paymentId: paymentId,
      paymentLink: payment.paymentLink,
      address: address,
      userId,
      methodPayment,
      status: 'pendente',
      productIds: produtosId,
      productAmounts: produtosQuantidade,
      productColors: produtosCores,
      valueProducts: produtosValores,
      orderTracking: '',
      totalPayment: Number((totalValue + +shippingOrder.price).toFixed(2)),
      discount: 0, 
      shippingValue: shippingOrder.price,
      shippingMethod: shippingOrder?.name,
      shippingCompany: shippingOrder?.company?.name
    })

    const createOrder = await newOrder.save()

    // Update amount

    for (let i = 0; i < itemsCart.length; i++) {
      const item = itemsCart[i];

      const productPrice = await Product.findOne({_id: item.productId}) as ProductDataBackEnd & {
        _id: string
      }

      const indexColor = productPrice.colors.indexOf(item?.color ?? '')

      let newAmount = [...productPrice.stock.amount]

      if (newAmount[indexColor] < item.amount) {
        return res.status(404).json({
          message: 'Estoque insuficiente'
        })
      }

      newAmount[indexColor] = newAmount[indexColor] - item.amount

      const options = { new: true, runValidators: true };
       await Product.findByIdAndUpdate(
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
      message: 'Pedido criado com sucesso', createOrder,
  })
    } catch (error) {
      res.status(
        400
      ).json({
        message: 'Erro ao criar o pedido', error
      })
    }

}

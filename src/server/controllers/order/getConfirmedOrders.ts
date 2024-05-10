import { Request, Response } from "express";

import Product from "../../db/models/Product";
import { OrderInterface, ProductDataBackEnd } from "../../shared/helpers/Interfaces";
import Orders from "../../db/models/Orders";

export const getConfirmedOrders = async (req: Request, res: Response) =>{
    try {
    const orders = await Orders.find({status: 'confirmado'}) as OrderInterface[]
    
    if (!orders[0]) {
      return res.status(200).json({
        message: 'Nenhum pedido encontrado'
      })
    }
    return res.status(200).json({
      pedidos: orders
  })
    } catch (error) {
      res.status(
        400
      ).json({
        erro: 'Erro ao buscar pedidos confirmados', error
      })
    }

}

import { Request, Response } from "express";

import Product from "../../db/models/Product";
import { OrderInterface } from "../../shared/helpers/Interfaces";
import Orders from "../../db/models/Orders";
import testeID from "../../shared/helpers/verifyId";

export const getOrderById = async (req: Request, res: Response) =>{
    const { orderId } = req.params;

    if (!orderId) {
        return res.status(400).json({
            message: 'É necessário o id do pedido'
        })
    }
    if (!testeID(orderId)) {
      return res.status(400).json({
        error: 'ID não correspondente'
      })
    }
    
    try {

    const order = await Orders.findById(orderId.toString()) as OrderInterface

    if (!order) {
      return res.status(404).json({
        message: 'Nenhum pedido encontrado'
      })

    }
    return res.status(200).json({
      pedido: order
  })
    } catch (error) {
      console.log(error)
      res.status(
        400
      ).json({
        message: 'Erro ao buscar o pedido', error
      })
    }

}

import { Request, Response } from "express";

import Product from "../../db/models/Product";
import { OrderInterface, ProductDataBackEnd } from "../../shared/helpers/Interfaces";
import Orders from "../../db/models/Orders";

export const getOrderById = async (req: Request, res: Response) =>{
    const { orderId } = req.params;

    if (!orderId) {
        return res.status(400).json({
            message: 'É necessário o id do pedido'
        })
    }

    try {
    const order = await Orders.findById(orderId) as OrderInterface

    
    if (!order) {
      return res.status(404).json({
        message: 'Nenhum pedido encontrado'
      })

    }
    return res.status(200).json({
      pedido: order
  })
    } catch (error) {
      res.status(
        400
      ).json({
        message: 'Erro ao cancelar o pedido', error
      })
    }

}

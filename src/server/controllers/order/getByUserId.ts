import { Request, Response } from "express";

import Product from "../../db/models/Product";
import { OrderInterface, ProductDataBackEnd } from "../../shared/helpers/Interfaces";
import Orders from "../../db/models/Orders";

export const getOrderByUserId = async (req: Request, res: Response) =>{
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            message: 'É necessário o id do usuário'
        })
    }

    try {
    const orders = await Orders.find({userId: userId}).sort({createdAt: -1})

    
    if (!orders[0]) {
      return res.status(404).json({
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
        message: 'Erro ao cancelar o pedido', error
      })
    }

}

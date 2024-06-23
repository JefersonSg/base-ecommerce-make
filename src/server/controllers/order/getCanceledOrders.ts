import { type Request, type Response } from 'express';

import Orders from '../../db/models/Orders';

export const getCanceledOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Orders.find({
      status: 'cancelado'
    });

    if (!orders[0]) {
      return res.status(404).json({
        message: 'Nenhum pedido encontrado'
      });
    }
    return res.status(200).json({
      pedidos: orders
    });
  } catch (error) {
    res.status(400).json({
      message: 'Erro ao buscar pedidos cancelados',
      error
    });
  }
};

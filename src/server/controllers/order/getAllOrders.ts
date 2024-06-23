import { type Request, type Response } from 'express';

import { type OrderInterface } from '../../shared/helpers/Interfaces';
import Orders from '../../db/models/Orders';

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = (await Orders.find().sort(
      '-createdAt'
    )) as unknown as OrderInterface[];
    const statistic = await Orders.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    if (!orders[0]) {
      return res.status(404).json({
        message: 'Nenhum pedido encontrado'
      });
    }

    return res.status(200).json({
      pedidos: orders,
      estatisticas: statistic
    });
  } catch (error) {
    res.status(400).json({
      message: 'Erro ao buscar o pedidos',
      error
    });
  }
};

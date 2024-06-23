import { type Request, type Response } from 'express';

import Orders from '../../db/models/Orders';

export const getOrderByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      message: 'É necessário o id do usuário'
    });
  }

  try {
    const orders = await Orders.find({ userId }).sort('-createdAt');

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
      message: 'Erro ao cancelar o pedido',
      error
    });
  }
};

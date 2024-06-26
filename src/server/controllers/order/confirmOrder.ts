import { type Request, type Response } from 'express';

import { type OrderInterface } from '../../shared/helpers/Interfaces';
import Orders from '../../db/models/Orders';

export const confirmOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({
      message: 'É necessário o id do pedido'
    });
  }

  try {
    const order = (await Orders.findById(orderId)) as OrderInterface;

    if (!order) {
      return res.status(404).json({
        message: 'Nenhum pedido encontrado'
      });
    }

    if (order.status === 'cancelado') {
      return res.status(404).json({
        message: 'O pedido já foi cancelado anteriormente'
      });
    }
    if (order.status !== 'pendente') {
      return res.status(404).json({
        message: 'O pedido não pode ser confirmado / status superior'
      });
    }

    const pedidoConfirmado = await Orders.findOneAndUpdate(
      { _id: orderId },
      {
        $set: { status: 'confirmado' }
      }
    );

    return res.status(200).json({
      message: 'Pedido confirmado com sucesso',
      pedidoConfirmado
    });
  } catch (error) {
    res.status(400).json({
      message: 'Erro ao cancelar o pedido',
      error
    });
  }
};

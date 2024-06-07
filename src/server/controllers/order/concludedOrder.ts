import { type Request, type Response } from "express";

import { type OrderInterface } from "../../shared/helpers/Interfaces";
import Orders from "../../db/models/Orders";

export const concludedOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({
      message: "É necessário o id do pedido",
    });
  }

  try {
    const order = (await Orders.findById(orderId)) as OrderInterface;

    if (!order) {
      return res.status(404).json({
        message: "Nenhum pedido encontrado",
      });
    }

    if (order.status === "cancelado") {
      return res.status(404).json({
        message: "O pedido já foi cancelado anteriormente",
      });
    }

    const pedidoConfirmado = await Orders.findOneAndUpdate(
      { _id: orderId },
      {
        $set: { status: "concluido" },
      },
    );

    return res.status(200).json({
      message: "Pedido concluido com sucesso",
      pedidoConfirmado,
    });
  } catch (error) {
    res.status(400).json({
      message: "Erro ao cancelar o pedido",
      error,
    });
  }
};

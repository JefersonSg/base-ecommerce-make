import { type Request, type Response } from "express";

import Orders from "../../db/models/Orders";
import {
  type ProductDataBackEnd,
  type OrderInterface,
} from "../../shared/helpers/Interfaces";
import Product from "../../db/models/Product";

export const reversalOrder = async (req: Request, res: Response) => {
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

    for (let i = 0; i < order.productIds.length; i++) {
      const productId = order.productIds[i];
      const color = order.productColors[i];
      const amount = order.productAmounts[i];
      const size = order.productSizes[i];


      const productPrice = (await Product.findOne({
        _id: productId,
      })) as ProductDataBackEnd & {
        _id: string;
      };
      const indexColor = productPrice.colors.indexOf(color);
      const indexSize = productPrice.size.indexOf(size);

      if (indexColor && indexSize) {
        const newAmount = [...productPrice.stock.amount];

        newAmount[indexColor][indexSize] = newAmount[indexColor][indexSize] + amount;  
  
        const options = { new: true, runValidators: true };
  
        await Product.findByIdAndUpdate(
          productId,
          { $set: { "stock.amount": newAmount } },
          options,
        );
      }
    }

    const pedidoDevolvido = await Orders.findOneAndUpdate(
      { _id: orderId },
      {
        $set: { status: "devolvido" },
      },
    );

    return res.status(200).json({
      message: "Pedido devolvido",
      pedidoDevolvido,
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: "Erro ao cancelar o pedido",
      error,
    });
  }
};

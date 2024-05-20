/* eslint-disable @typescript-eslint/no-base-to-string */
import { type Request, type Response } from "express";
import { MercadoPagoConfig, Payment } from "mercadopago";
import Orders from "../../../db/models/Orders";

export const receiveWebhook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const paymentQuery = req.query;

    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN ?? "",
    });

    if (paymentQuery?.["data.id"]) {
      const payment = await new Payment(client).capture({
        id: paymentQuery["data.id"].toString(),
      });

      const order = await Orders.find({ paymentId: id });

      if (payment.status === "approved" && order) {
        await Orders.findOneAndUpdate(
          { paymentId: id },
          {
            $set: { status: "confirmado" },
          },
        );
      }
    }

    res.send("webhook");
  } catch (error) {
    return res.status(500).json({
      erro: "erro ao buscar status do pagamento",
      error,
    });
  }
};

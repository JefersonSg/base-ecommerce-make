import { Request, Response } from "express";
import 'dotenv/config'

import { MercadoPagoConfig, Preference } from 'mercadopago'
import 'dotenv/config'

interface Itens {
  id: string;
  title: string;
  quantity: number,
  unit_price: number,
}

export async function Payment(items: Itens[], frete: Itens, paymentId: string) {
  try {
    const client = await new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN ?? '' })

    const preference = await new Preference(client)

    const newPayment = await preference.create({
      body: {
        items: [
          ...items,
          frete
        ],
        back_urls: {
          success: `${process.env.FRONT_URL}/pagamento/sucesso`,
          failure:`${process.env.FRONT_URL}/pagamento/error` ,
          pending:`${process.env.FRONT_URL}/pagamento/pendente` ,
        },
        notification_url: `https://mayse.fun/payment/webhook/${paymentId}`
      } ,
    }, )

    return { paymentLink: newPayment?.init_point , id: newPayment.collector_id}

  } catch (error : any) {
    return 
  }
}
import { Request, Response } from "express";
import 'dotenv/config'

import { MercadoPagoConfig, Preference } from 'mercadopago'
import { AddressInterface } from "../../../shared/helpers/Interfaces";

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
          success: 'http://localhost:3000/minha-conta/pedidos',
          failure:'http://localhost:3000/minha-conta/pedidos' ,
          pending:'http://localhost:3000/minha-conta/pedidos' ,
        },
        notification_url: `https://cc6e-2804-56c-d506-8500-702e-3900-b916-cb78.ngrok-free.app/payment/webhook/${paymentId}`
      } ,
    }, )

    console.log(newPayment)
    return { paymentLink: newPayment?.init_point , id: newPayment.collector_id}

  } catch (error : any) {
    return 
  }
}
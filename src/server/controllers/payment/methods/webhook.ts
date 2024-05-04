import { Request, Response } from "express";
import {MercadoPagoConfig, Preference, Payment} from "mercadopago";
import Orders from "../../../db/models/Orders";



export const receiveWebhook = async (req: Request, res: Response) =>{
    try {
        const { id }= req.params
    const paymentQuery = req.query

        console.log(paymentQuery?.['data.id'])

        const client =  new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN ?? '' })

        if (paymentQuery?.['data.id']) {
            
            const payment = await new Payment(client).capture({id: paymentQuery['data.id'].toString()})

            const order = await Orders.find({paymentId: id})


            if (payment.status === 'approved' && order) {
                const update = await Orders.findOneAndUpdate({paymentId: id}, {
                    $set: {status: 'confirmado'}
                })

                console.log(update)
            }
        }

    res.send('webhook')
    } catch (error) {
        return res.status(500).json({
                erro: 'erro ao buscar status do pagamento' , error
        })
    }
}
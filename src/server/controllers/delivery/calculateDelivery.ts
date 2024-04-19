import { Request, Response } from "express";
import axios from 'axios'

import 'dotenv/config'


export const calculateDelivery = async(req: Request, res: Response)=>{
try {


    const config = {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN_MELHOR_ENVIO}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Aplicação (jefersongabri@gmail.com)',
          'Accept':'application/json'
        }
      };

    const { cep } = req.body
    
    const cepLimpo = cep.replace('-','')


    if (cepLimpo.length === 8 ) {

        const args = {
            "from": {
                "postal_code": "28470000"
            },
            "to": {
                "postal_code": '28300000'
            },
            "products": [
                {
                    "id": "x",
                    "width": 11,
                    "height": 17,
                    "length": 11,
                    "weight": 0.3,
                    "insurance_value": 10.1,
                    "quantity": 1
                }
            ],
            "options": {
                "receipt": false,
                "own_hand": false
            },
            "services": "1,2,3,4"
        }

        const apiEnvio = 'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate'

       const calculo = await axios.post(apiEnvio, args, config)

       const response = await calculo.data
       return res.status(200).json({
        response
       })
    } else {
        return res.status(400).json({
            erro: 'verifique o cep digitado'
        })
    }




    
} catch (error ) {
    return res.status(400).json({
        erro: 'Nenhum cep', error
    })
}

}
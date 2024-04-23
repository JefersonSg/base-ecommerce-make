import axios from 'axios'
import 'dotenv/config'
import { ItemsCartInterface } from './Interfaces';


const config = {
    headers: {
      Authorization: `Bearer ${process.env.TOKEN_MELHOR_ENVIO}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Aplicação (jefersongabri@gmail.com)',
      'Accept':'application/json'
    }
  };


export const calculateDeliveryFunc = async(cep: string, itemsCart: ItemsCartInterface[], actualValue: number[], serviceNumber?: string)=>{
try {

    const cepLimpo = cep.replace('-','')
    

    const productInfos = await itemsCart.map((item: ItemsCartInterface, index)=>{
        return {
            "id": item.productId.toString(),
            "width": 11,
            "height": 10,
            "length": 11,
            "weight": 0.15,
            "insurance_value": actualValue[index] / item.amount,
            "quantity": item.amount
        }
    })

    if (cepLimpo.length === 8 ) {

        const args = {
            "from": {
                "postal_code": `${process.env.CEP_ORIGIN}`
            },
            "to": {
                "postal_code": cepLimpo
            },
            "products": productInfos,
            "options": {
                "receipt": false,
                "own_hand": false
            },
            "services": `${serviceNumber ?? "1,2,3,4"}`
        }

        const apiEnvio = 'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate'

       const calculo = await axios.post(apiEnvio, args, config)

       const response = await calculo.data

       return  response
    } else {
            return { erro: 'verifique o cep digitado'}
    }
} catch (error ) {
    return { erro: 'Nenhum cep', error }
}

}
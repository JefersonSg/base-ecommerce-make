import { type Request, type Response } from 'express';
import axios from 'axios';

import 'dotenv/config';

const config = {
  headers: {
    Authorization: `Bearer ${process.env.TOKEN_MELHOR_ENVIO}`,
    'Content-Type': 'application/json',
    'User-Agent': 'Aplicação (jefersongabri@gmail.com)',
    Accept: 'application/json'
  }
};

export const calculateDelivery = async (req: Request, res: Response) => {
  try {
    const { cep } = req.body;
    const cepLimpo = cep.replace('-', '');
    const CepOrigin = process.env.CEP_ORIGIN;

    if (cepLimpo.length === 8) {
      const args = {
        from: {
          postal_code: `${process.env.CEP_ORIGIN}`
        },
        to: {
          postal_code: cepLimpo
        },
        products: [
          {
            id: 'x',
            width: 11,
            height: 17,
            length: 11,
            weight: 0.1,
            insurance_value: 10.1,
            quantity: 1
          }
        ],
        options: {
          receipt: false,
          own_hand: false
        },
        services: '1,2,3,4'
      };

      const apiEnvio =
        'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate';

      const calculo = await axios.post(apiEnvio, args, config);

      const response = await calculo.data;

      if (CepOrigin === cepLimpo) {
        const retirada = {
          id: 99,
          name: 'Retirada na loja',
          price: '00.00',
          custom_price: '00.00',
          currency: 'R$',
          delivery_time: 1,
          delivery_range: { max: 'Combinar' },
          custom_delivery_time: 'Combinar',
          custom_delivery_range: { min: 1, max: 'Combinar' },
          company: {
            id: 1,
            name: 'Retirada na loja',
            picture: ''
          }
        };

        const motoboy = {
          id: 100,
          name: 'Motoboy',
          price: '10.00',
          custom_price: '10.00',
          currency: 'R$',
          delivery_time: 1,
          delivery_range: { max: '2 Horas' },
          custom_delivery_time: '2 Horas',
          custom_delivery_range: { max: '2 Horas' },
          company: {
            id: 1,
            name: 'Motoboy',
            picture: ''
          }
        };

        response.unshift(motoboy, retirada);
      }
      return res.status(200).json({
        response
      });
    } else {
      return res.status(400).json({
        erro: 'verifique o cep digitado'
      });
    }
  } catch (error) {
    return res.status(400).json({
      erro: 'Nenhum cep',
      error
    });
  }
};

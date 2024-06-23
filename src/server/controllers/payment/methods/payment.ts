import 'dotenv/config';

import { MercadoPagoConfig, Preference } from 'mercadopago';

interface Itens {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
}

export async function Payment(
  items: Itens[],
  paymentId: string,
  frete?: Itens
) {
  try {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN ?? ''
    });

    const preference = new Preference(client);

    const newPayment = await preference.create({
      body: {
        items: frete ? [...items, frete] : [...items],
        payment_methods: {},
        back_urls: {
          success: `${process.env.FRONT_URL}/pagamento/sucesso`,
          failure: `${process.env.FRONT_URL}/pagamento/error`,
          pending: `${process.env.FRONT_URL}/pagamento/pendente`
        },
        notification_url: `https://mayse.fun/payment/webhook/${paymentId}`
      }
    });

    return { paymentLink: newPayment?.init_point, id: newPayment.collector_id };
  } catch (error: any) {}
}

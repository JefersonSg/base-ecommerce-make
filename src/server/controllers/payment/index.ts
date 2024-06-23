import * as payment from './methods/payment';
import * as receiveWebhook from './methods/webhook';

export const PaymentController = {
  ...payment,
  ...receiveWebhook
};

import * as consultCep from './consultCep';
import * as calculateDelivery from './calculateDelivery';

export const deliveryController = {
  ...consultCep,
  ...calculateDelivery
};

import * as cancelOrder from "./cancelOrder";
import * as  createOrder  from "./createOrder";
import * as confirmOrder from './confirmOrder'


export const orderController = {
    ...createOrder,
    ...cancelOrder,
    ...confirmOrder
  };
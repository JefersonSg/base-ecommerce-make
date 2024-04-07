import * as cancelOrder from "./cancelOrder";
import * as  createOrder  from "./createOrder";
import * as confirmOrder from './confirmOrder';
import * as getAllOrders from './getAllOrders'
import * as getByOrderId from './getByOrderId';
import * as getByUserId from './getByUserId';
import * as getCanceledOrders from './getCanceledOrders';
import * as getConfirmedOrders from './getConfirmedOrders';
import * as getPendentOrders from './getPendentOrders';
import * as getDispatchedOrders from './getDispatchedOrders';


export const orderController = {
    ...createOrder,
    ...cancelOrder,
    ...confirmOrder,
    ...getAllOrders,
    ...getByOrderId,
    ...getByUserId,
    ...getCanceledOrders,
    ...getConfirmedOrders,
    ...getPendentOrders,
    ...getDispatchedOrders
  };
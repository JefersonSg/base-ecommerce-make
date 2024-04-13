import express from "express";
const router = express.Router();

import { orderController } from "../controllers";

// middleware
import checkToken from "../shared/helpers/checkToken";


//  gets
router.get(
  "/get-all",
  checkToken,
  orderController.getAllOrders,
);
router.get(
  "/get-order-by-user-id/:userId",
  orderController.getOrderByUserId,
);
router.get(
  "/get-order-by-id/:orderId",
  checkToken,
  orderController.getOrderById,
);
router.get(
  "/get-canceled",
  checkToken,
  orderController.getCanceledOrders,
);
router.get(
  "/get-confirmed",
  checkToken,
  orderController.getConfirmedOrders,
);
router.get(
  "/get-dispatched",
  checkToken,
  orderController.getDispatchedOrders,
);
router.post(
  "/create/:userId",
  checkToken,
  orderController.createOrder,
);
router.patch(
  "/cancel/:orderId",
  checkToken,
  orderController.cancelOrder,
);
router.patch(
  "/confirm/:orderId",
  checkToken,
  orderController.confirmOrder,
);
router.patch(
  "/dispatch/:orderId",
  checkToken,
  orderController.dispatchedOrder,
);
router.patch(
  "/reversal/:orderId",
  checkToken,
  orderController.dispatchedOrder,
);
router.patch(
  "/concluded/:orderId",
  checkToken,
  orderController.concludedOrder,
);


export default router;

import express from "express";
const router = express.Router();

import { orderController } from "../controllers";

// middleware
import checkToken from "../shared/helpers/checkToken";

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
  orderController.orderDispatched,
);
router.get(
  "/get/All",
  checkToken,
  orderController.getAllOrders,
);
router.get(
  "/get/:orderId",
  checkToken,
  orderController.getOrderById,
);
router.get(
  "/get/canceled",
  checkToken,
  orderController.getCanceledOrders,
);
router.get(
  "/get/confirmed",
  checkToken,
  orderController.getConfirmedOrders,
);
router.get(
  "/get/dispatched",
  checkToken,
  orderController.getDispatchedOrders,
);

export default router;

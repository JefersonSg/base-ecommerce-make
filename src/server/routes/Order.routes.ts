/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { orderController } from "../controllers";

// middleware
import checkToken from "../shared/helpers/checkToken";
import checkAdminToken from "../shared/helpers/checkAdminToken";
const router = express.Router();

//  gets
router.get("/get-all", checkAdminToken, orderController.getAllOrders);
router.get("/get-order-by-user-id/:userId", orderController.getOrderByUserId);
router.get(
  "/get-order-by-id/:orderId",
  checkToken,
  orderController.getOrderById,
);
router.get("/get-canceled", checkToken, orderController.getCanceledOrders);
router.get("/get-confirmed", checkToken, orderController.getConfirmedOrders);
router.get("/get-dispatched", checkToken, orderController.getDispatchedOrders);

router.post("/create/:userId", checkToken, orderController.createOrder);

router.patch("/cancel/:orderId", checkAdminToken, orderController.cancelOrder);
router.patch(
  "/confirm/:orderId",
  checkAdminToken,
  orderController.confirmOrder,
);
router.patch(
  "/dispatch/:orderId",
  checkAdminToken,
  orderController.dispatchedOrder,
);
router.patch(
  "/return/:orderId",
  checkAdminToken,
  orderController.reversalOrder,
);
router.patch(
  "/concluded/:orderId",
  checkAdminToken,
  orderController.concludedOrder,
);

export default router;

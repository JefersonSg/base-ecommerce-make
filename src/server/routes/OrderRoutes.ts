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

export default router;

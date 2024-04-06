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

export default router;

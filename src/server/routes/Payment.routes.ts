import express from "express";
const router = express.Router();

import { PaymentController } from "../controllers";

// middleware
import checkToken from "../shared/helpers/checkToken";

router.post(
  "/webhook/:id",
  PaymentController.receiveWebhook,
);

export default router;

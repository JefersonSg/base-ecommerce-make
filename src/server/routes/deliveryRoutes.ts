import express from "express";
const router = express.Router();

import { deliveryController } from "../controllers";

// middleware
import checkToken from "../shared/helpers/checkToken";

router.post(
  "/consult-cep",
  deliveryController.consultCep,
);

router.post(
    '/calculate',
    deliveryController.calculateDelivery
)


export default router;

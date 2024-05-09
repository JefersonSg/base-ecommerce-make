import express from "express";
const router = express.Router();

import { deliveryController } from "../controllers";

router.post(
  "/consult-cep",
  deliveryController.consultCep,
);

router.post(
    '/calculate',
    deliveryController.calculateDelivery
)


export default router;

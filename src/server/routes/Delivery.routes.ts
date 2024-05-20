/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";

import { deliveryController } from "../controllers";
const router = express.Router();

router.post("/consult-cep", deliveryController.consultCep);

router.post("/calculate", deliveryController.calculateDelivery);

export default router;

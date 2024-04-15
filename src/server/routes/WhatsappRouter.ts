import express from "express";
const router = express.Router();

import { WhatsAppControl } from "../controllers";

// middleware
import checkToken from "../shared/helpers/checkToken";

router.post(
  "/",
  WhatsAppControl.LoginWhatsApp
);

export default router;

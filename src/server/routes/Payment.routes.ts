/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { PaymentController } from '../controllers';

// middleware
const router = express.Router();

router.post('/webhook/:id', PaymentController.receiveWebhook);

export default router;

/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { cuponsController } from '../controllers';
import checkAdminToken from '../shared/helpers/checkAdminToken';
import checkToken from '../shared/helpers/checkToken';

const router = express.Router();

router.get('/get-all', checkAdminToken, cuponsController.getAllCupons);

router.post(
  '/create',
  checkAdminToken,
  cuponsController.validationCupons,
  cuponsController.createCoupon
);

router.post('/redeem', checkToken, cuponsController.redeemCupom);

router.patch('/toggle/:id', checkAdminToken, cuponsController.toggleCupom);

router.delete('/delete/:id', checkAdminToken, cuponsController.deleteCupom);

export default router;

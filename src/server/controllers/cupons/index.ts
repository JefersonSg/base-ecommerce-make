import * as createCoupon from './create';
import * as deleteCupom from './delete';
import * as getAllCupons from './getAllCupons';
import * as redeemCupom from './redeem';
import * as toggleCupom from './toggleCupom';
import * as validationCupons from './validationCupons';

export const cuponsController = {
  ...validationCupons,
  ...createCoupon,
  ...getAllCupons,
  ...deleteCupom,
  ...toggleCupom,
  ...redeemCupom
};

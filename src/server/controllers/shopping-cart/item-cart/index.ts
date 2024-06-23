import * as addNewItemCart from './create';
import * as updateItemCart from './update';
import * as removeItemCartById from './removeById';
import * as validationItemCart from './validationEditItemCart';

export const ItemShoppingCartControl = {
  ...addNewItemCart,
  ...updateItemCart,
  ...removeItemCartById,
  ...validationItemCart
};

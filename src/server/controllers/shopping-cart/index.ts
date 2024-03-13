import * as update from "./update";
import * as addNewItemCart from "./item-cart/create";
import * as removeItemCartById from "./item-cart/removeById";
import * as getAllItemsCart from "./item-cart/getAll";
import * as updateItemCart from "./item-cart/update";
import * as updateShoppingCart from "./update";
import * as validationCreateItemCart from "./item-cart/validationCreateItemCart";
import * as validationEditItemCart from "./item-cart/validationEditItemCart";

export const ShoppingCartControl = {
  ...update,
  ...addNewItemCart,
  ...getAllItemsCart,
  ...removeItemCartById,
  ...updateItemCart,
  ...updateShoppingCart,
  ...validationCreateItemCart,
  ...validationEditItemCart,
};

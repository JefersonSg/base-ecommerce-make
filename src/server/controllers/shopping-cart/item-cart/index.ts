import * as addNewItemCart from "./create";
import * as updateItemCart from "./update";
import * as removeItemCartById from "./removeById";
import * as validationItemCart from "./validationCreateItemCart";

export const ItemShoppingCartControl = {
  ...addNewItemCart,
  ...updateItemCart,
  ...removeItemCartById,
  ...validationItemCart,
};

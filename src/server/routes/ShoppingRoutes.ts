import express from "express";
const router = express.Router();

import { ShoppingCartControl } from "../controllers";

// middleware
import checkToken from "../shared/helpers/checkToken";

// Carrinho
router.get("/get-all/:userId", ShoppingCartControl.getAllItemsCart);

// Item carrinho
router.post(
  "/create",
  checkToken,
  ShoppingCartControl.validationCreateItemCart,
  ShoppingCartControl.addNewItemCart,
);

router.patch(
  "/update/:itemId",
  checkToken,
  ShoppingCartControl.validationEditItemCart,
  ShoppingCartControl.updateItemCart,
);

router.delete(
  "/delete/:itemId",
  checkToken,
  ShoppingCartControl.removeItemCartById,
);

export default router;

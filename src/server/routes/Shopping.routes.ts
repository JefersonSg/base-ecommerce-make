/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";

import { ShoppingCartControl } from "../controllers";

// middleware
import checkToken from "../shared/helpers/checkToken";
const router = express.Router();

// Carrinho
router.post("/get-all/:userId", ShoppingCartControl.getAllItemsCart);

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

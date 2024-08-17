/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { ShoppingCartControl } from '../controllers';

// middleware
const router = express.Router();

// Carrinho
router.post('/get-all/:userId', ShoppingCartControl.getAllItemsCart);

// Item carrinho
router.post(
  '/create',
  ShoppingCartControl.validationCreateItemCart,
  ShoppingCartControl.addNewItemCart
);

router.patch(
  '/update/:itemId',
  ShoppingCartControl.validationEditItemCart,
  ShoppingCartControl.updateItemCart
);

router.delete('/delete/:itemId', ShoppingCartControl.removeItemCartById);

export default router;

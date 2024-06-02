/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { FavoritesControl } from "../controllers";

// middleware
import checkToken from "../shared/helpers/checkToken";
const router = express.Router();

router.post(
  "/create",
  checkToken,
  FavoritesControl.validationFavorite,
  FavoritesControl.create,
);

router.get("/get-by-user/:userId", FavoritesControl.getAllFavoritesUser);

router.delete("/delete/:id", checkToken, FavoritesControl.deleteById);

export default router;

import express from "express";
const router = express.Router();

import { FavoritesControl } from "../controllers";

// middleware
import checkToken from "../shared/helpers/checkToken";

router.post("/create",checkToken, FavoritesControl.validationFavorite, FavoritesControl.create);

router.get("/get-by-user/:userId", FavoritesControl.getAllFavoritesUser);

router.delete("/delete/:id", checkToken, FavoritesControl.deleteById)

export default router;

/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";

import { ProductController } from "../controllers";
const router = express.Router();

router.get("/get-all", ProductController.getAllViews);
router.get("/:productId", ProductController.getViewsByProductId);
router.get("/get-by-views/", ProductController.getAllProductsViews);

router.post("/add/:productId", ProductController.addView);

export default router;

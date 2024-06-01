/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { ViewsController } from "../controllers";

const router = express.Router();

router.get("/get-all-views/:daysAgo?", ViewsController.getAllViews);
router.get("/product/:productId", ViewsController.getViewsByProductId);
router.get("/get-by-views/", ViewsController.getAllProductsViews);

router.post("/add/:productId", ViewsController.addView);

export default router;

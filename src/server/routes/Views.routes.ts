import express from "express";
const router = express.Router();

import { ProductController } from "../controllers";

router.get("/get-all", ProductController.getAllViews);
router.get("/:productId", ProductController.getViewsByProductId);
router.get("/get-by-views/", ProductController.getAllProductsViews);


router.post("/add/:productId", ProductController.addView);


export default router;

import express from "express";
const router = express.Router();
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import { ProductController } from "../controllers";

// middleware
import checkToken from "../shared/helpers/checkToken";

// GETS
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getProductById);
router.get("/categories/:id", ProductController.getProductByCategory);

// POST
router.post(
  "/create",
  checkToken,
  upload.array("images"),
  ProductController.validationProduct,
  ProductController.create,
);

// UPDATE
router.patch(
  "/edit/:id",
  checkToken,
  upload.array("images"),
  ProductController.validationProduct,
  ProductController.updateProduct,
);

// DELETE
router.delete("/delete/:id", checkToken, ProductController.removeProductById);

export default router;

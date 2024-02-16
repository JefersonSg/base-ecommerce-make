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
// comments
router.get("/comments/:id", ProductController.getAllComments);

// POST
router.post(
  "/create",
  checkToken,
  upload.array("images"),
  ProductController.validationProduct,
  ProductController.create,
);
// comments
router.post(
  "/create/comment/:id",
  checkToken,
  upload.array("images"),
  ProductController.createComment,
);

// UPDATE
router.patch(
  "/edit/:id",
  checkToken,
  upload.array("images"),
  ProductController.validationProduct,
  ProductController.updateProduct,
);
// comments
router.patch(
  "/update/comment/:id",
  checkToken,
  upload.array("images"),
  ProductController.updateCommentById,
);

// DELETE
router.delete("/delete/:id", checkToken, ProductController.removeProductById);
router.delete("/delete/comment/:id", checkToken, ProductController.removeCommentById);

export default router;

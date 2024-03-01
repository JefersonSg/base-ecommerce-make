import express from "express";
const router = express.Router();
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import { ProductController } from "../controllers";

// middleware
import checkToken from "../shared/helpers/checkToken";
import handleUploadError from "../shared/middleware/handleUploadError";

// GETS
router.get("/", ProductController.getAll);
router.get("/actives", ProductController.getAllActives);
router.get("/:id", ProductController.getProductById);
router.get("/category/:id", ProductController.getProductByCategory);
router.get("/name/:name", ProductController.getProductByCategory);
router.get("/subcategory/:id", ProductController.getBySubcategory);
// comments
router.get("/comments/get-all/:productId", ProductController.getAllComments);

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
  "/create/comment",
  checkToken,
  upload.single("image"),
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
  "/update/comment",
  checkToken,
  upload.single("image"),
  ProductController.updateCommentById,
);

// DELETE
router.delete("/delete/:id", checkToken, ProductController.removeProductById);

// comment
router.delete("/delete/comment/:id", checkToken, ProductController.removeCommentById);

export default router;

import express from "express";
const router = express.Router();
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import { ProductController } from "../controllers";

// middleware
import checkToken from "../shared/helpers/checkToken";
import checkAdminToken from "../shared/helpers/checkAdminToken";

// GETS
router.get("/", ProductController.getAll);
router.get("/actives", ProductController.getAllActives);
router.get("/:id", ProductController.getProductById);
router.get("/category/:id", ProductController.getProductByCategory);
router.get("/name/:name", ProductController.getByName);
router.get("/subcategory/:id", ProductController.getBySubcategory);
router.get("/sales/get-all", ProductController.getBySales);
router.get("/views/get-all", ProductController.getByViews);
router.get("/promotion/get-all" ,ProductController.getByPromotion);

// comments
router.get("/comments/get-all/:productId", ProductController.getAllComments);

// POST
router.post(
  "/create",
  checkAdminToken,
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
  checkAdminToken,
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
router.delete("/delete/:id", checkAdminToken, ProductController.removeProductById);

// comment
router.delete(
  "/delete/comment/:id",
  checkToken,
  ProductController.removeCommentById,
);


export default router;

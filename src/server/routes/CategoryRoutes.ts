import express from "express";
const router = express.Router();

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import checkToken from "../shared/helpers/checkToken";

import { CategoryController } from "../controllers";

// GET
router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getCategoryById);

// POST
router.post(
  "/create",
  checkToken,
  upload.single("image"),
  CategoryController.createCategory,
);

// UPDATE
router.patch(
  "/edit/:id",
  checkToken,
  upload.single("image"),
  CategoryController.updateCategory,
);

// DELETE
router.delete("/delete/:id", checkToken, CategoryController.deleteCategory);

export default router;

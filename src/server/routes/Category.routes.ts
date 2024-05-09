import express from "express";
const router = express.Router();

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import checkToken from "../shared/helpers/checkToken";

import { CategoryController } from "../controllers";
import checkAdminToken from "../shared/helpers/checkAdminToken";

// GET
router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getById);

// POST
router.post(
  "/create",
  checkAdminToken,
  upload.single("image"),
  CategoryController.validationCategory,
  CategoryController.createCategory,
);

// UPDATE
router.patch(
  "/edit/:id",
  checkAdminToken,
  upload.single("image"),
  CategoryController.validationCategory,
  CategoryController.updateCategory,
);

// DELETE
router.delete("/delete/:id", checkAdminToken, CategoryController.deleteCategory);

export default router;

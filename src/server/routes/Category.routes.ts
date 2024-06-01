/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import multer from "multer";
import { CategoryController } from "../controllers";
import checkAdminToken from "../shared/helpers/checkAdminToken";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
router.delete(
  "/delete/:id",
  checkAdminToken,
  CategoryController.deleteCategory,
);

export default router;

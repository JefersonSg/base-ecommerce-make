import express from "express";
const router = express.Router();

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import checkToken from "../shared/helpers/checkToken";

import { SubcategoryController } from "../controllers";

// GET
router.get("/", SubcategoryController.getAll);
router.get("/:id", SubcategoryController.getById);
router.get("/category/:id", SubcategoryController.getByCategory);

// CREATE
router.post(
  "/create",
  checkToken,
  upload.single("image"),
  SubcategoryController.validationSubcategory,
  SubcategoryController.createSubcategory,
);

// UPDATE
router.patch(
  "/edit/:id",
  checkToken,
  upload.single("image"),
  SubcategoryController.update,
);

// DELETE
router.delete(
  "/delete/:id",
  checkToken,
  SubcategoryController.deleteSubcategory,
);

export default router;

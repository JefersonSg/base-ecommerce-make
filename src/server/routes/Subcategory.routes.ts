/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import multer from "multer";
import { SubcategoryController } from "../controllers";
import checkAdminToken from "../shared/helpers/checkAdminToken";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET
router.get("/", SubcategoryController.getAll);
router.get("/:id", SubcategoryController.getById);
router.get("/category/:id", SubcategoryController.getByCategory);

// CREATE
router.post(
  "/create",
  checkAdminToken,
  upload.single("image"),
  SubcategoryController.validationSubcategory,
  SubcategoryController.createSubcategory,
);

// UPDATE
router.patch(
  "/edit/:id",
  checkAdminToken,
  upload.single("image"),
  SubcategoryController.update,
);

// DELETE
router.delete(
  "/delete/:id",
  checkAdminToken,
  SubcategoryController.deleteSubcategory,
);

export default router;

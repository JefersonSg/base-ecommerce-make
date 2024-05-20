/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import multer from "multer";

import { BannersControl } from "../controllers";

// middleware
import checkAdminToken from "../shared/helpers/checkAdminToken";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/create",
  upload.array("images"),
  checkAdminToken,
  BannersControl.validationBanner,
  BannersControl.create,
);

router.get("/", BannersControl.getAll);
router.get("/actives", BannersControl.getAllActives);

router.patch(
  "/update/:id",
  checkAdminToken,
  upload.array("images"),
  BannersControl.validationBanner,
  BannersControl.updateBanner,
);

router.delete("/delete/:id", checkAdminToken, BannersControl.deleteBanner);

export default router;

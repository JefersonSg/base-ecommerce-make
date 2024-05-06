import express from "express";
const router = express.Router();
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import { BannersControl } from "../controllers";

// middleware
import checkToken from "../shared/helpers/checkToken";
import checkAdminToken from "../shared/helpers/checkAdminToken";

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

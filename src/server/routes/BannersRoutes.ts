import express from "express";
const router = express.Router();
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import { BannersControl } from "../controllers";

// middleware
import checkToken from "../shared/helpers/checkToken";

router.post(
  "/create",
  upload.array("images"),
  checkToken,
  BannersControl.validationBanner,
  BannersControl.create,
);

router.get("/", BannersControl.getAll);
router.get("/actives", BannersControl.getAllActives);

router.patch(
  "/update/:id",
  checkToken,
  upload.array("images"),
  BannersControl.validationBanner,
  BannersControl.updateBanner,
);

router.delete("/delete/:id", checkToken, BannersControl.deleteBanner);

export default router;

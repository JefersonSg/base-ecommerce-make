import express from "express";
const router = express.Router();
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import { UserController } from "../controllers";

// middleware
import checkToken from "../shared/helpers/checkToken";

router.post("/register", UserController.validationUser, UserController.create);
router.post("/login", UserController.validationLoginUser, UserController.login);
router.get("/checkuser", UserController.checkUser);
router.get("/:id", UserController.getUserById);
router.patch(
  "/edit/:id",
  checkToken,
  upload.single("image"),
  UserController.editUser,
);

export default router;

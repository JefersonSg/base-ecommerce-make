/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import multer from "multer";
import { UserController } from "../controllers";

// middleware
import checkToken from "../shared/helpers/checkToken";
import checkAdminToken from "../shared/helpers/checkAdminToken";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/register", UserController.validationUser, UserController.create);
router.post("/login", UserController.validationLoginUser, UserController.login);
router.get("/check-user", UserController.checkUser);
router.get("/get/:id", UserController.getUserById);
router.get("/get-all-users", checkAdminToken, UserController.getAll);
router.get("/token", UserController.getByToken);
router.patch(
  "/edit/:id",
  checkToken,
  upload.single("image"),
  UserController.editUser,
);

// address
router.get("/address", checkToken, UserController.getAddressById);
router.post(
  "/address/create",
  checkToken,
  UserController.validationCreateAddress,
  UserController.createAddress,
);

router.patch(
  "/address/update/:addressId",
  checkToken,
  UserController.validationCreateAddress,
  UserController.updateAddressById,
);

export default router;

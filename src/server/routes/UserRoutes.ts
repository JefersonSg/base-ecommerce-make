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
router.get("/check-user", UserController.checkUser);
router.get("/get/:id", UserController.getUserById);
router.get("/get-all-users", UserController.getAll);
router.get("/token", UserController.getByToken);
router.patch(
  "/edit/:id",
  checkToken,
  upload.single("image"),
  UserController.editUser,
);


// adress
router.get("/adress/:adressId", UserController.getAdressById);
router.post("/adress/create", UserController.validationUser, UserController.createAdress);
router.patch(
  "/adress/update/:adressId",
  checkToken,
  UserController.updateAddressById,
);

export default router;

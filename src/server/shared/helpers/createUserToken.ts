import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import "dotenv/config";
import { userInterface } from "../../controllers/user/interfaceUser";

const id_admin = process.env.ID_ADMIN ?? "";

const jwt = require("jsonwebtoken");
require("dotenv").config();

const createUserToken = async (
  user: userInterface,
  req: Request,
  res: Response,
) => {
  // create a token

  const secret = process.env.SECRET_JWT;

  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    secret,
  );

  // return token
  return res.status(200).json({
    message: "Você está autenticado",
    token: token,
    userId: user._id,
    admin: user.admin,
  });
};

export default createUserToken;

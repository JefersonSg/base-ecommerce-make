import { Request, Response } from "express";
import { ObjectId } from "mongoose";

const jwt = require("jsonwebtoken");
require("dotenv").config();

interface User {
  _id?: any;
  name: string;
}

const createUserToken = async (user: User, req: Request, res: Response) => {
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
  });
};

export default createUserToken;

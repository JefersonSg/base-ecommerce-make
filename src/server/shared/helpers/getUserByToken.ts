import { Response } from "express";

import jwt from "jsonwebtoken";
import "dotenv/config";

import User from "../../db/models/User";

interface DecodedToken {
  id: string;
}

const getUserByToken = async (res: Response, token: string) => {
  if (!token) {
    return false;
  }
  const secret = process.env.SECRET_JWT ?? "";

  const decoded = jwt.verify(token, secret) as DecodedToken;

  const userId = decoded.id;

  const user = await User.findOne({ _id: userId });

  if (!user) {
    return false;
  }

  return user;
};

export default getUserByToken;

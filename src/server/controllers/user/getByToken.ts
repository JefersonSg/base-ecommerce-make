import { Request, Response } from "express";
import User from "../../db/models/User";
import getUserByToken from "../../shared/helpers/getUserByToken";
import getToken from "../../shared/helpers/getToken";
import "dotenv/config";
import { userInterface } from "./interfaceUser";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const id_admin = process.env.ID_ADMIN ?? "";

export const getByToken = async (req: Request, res: Response) => {
  const token = await getToken(req);

  if (token) {
    const userToken = (await getUserByToken(
      res,
      token,
    )) as unknown as userInterface;

    if (!userToken) {
      res.status(422).json({ message: "Usuário não encontrado!" });
    }
    userToken.password = "";

    const isAdmin = userToken._id.toString() === id_admin;
    return res.status(200).json({ user: userToken, isAdmin: isAdmin });
  }

};

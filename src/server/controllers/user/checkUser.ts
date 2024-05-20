import { type Request, type Response } from "express";
import User from "../../db/models/User";
import getToken from "../../shared/helpers/getToken";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { type userInterface } from "../../controllers/user/interfaceUser";

const secret = process.env.SECRET_JWT ?? "";

export const checkUser = async (req: Request, res: Response) => {
  try {
    if (!req.headers.authorization) {
      return res.status(400).json({
        message: "Nenhum Token encontrado",
      });
    }

    const token: string = getToken(req);
    const decoded: any = jwt.verify(token, secret);
    const currentUser = (await User.findById(decoded.id)) as userInterface;

    if (!currentUser) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }
    // Converte o mongoose document para objeto JavaScript
    currentUser.password = "";

    return res.status(200).json({
      user: currentUser,
      isAdmin: currentUser.admin,
    });
  } catch (error) {
    console.log("erro no checkUser", error);
    return res.status(500).json({
      message: "erro no checkUser",
      error,
    });
  }
};

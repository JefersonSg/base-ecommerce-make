import { Request, Response } from "express";
import User from "../../db/models/User";
import getToken from "../../shared/helpers/getToken";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { userInterface } from "../../controllers/user/interfaceUser";

const id_admin = process.env.ID_ADMIN ?? "";
const secret = process.env.SECRET_JWT || "";

export const checkUser = async (req: Request, res: Response) => {
  try {
    if (!req.headers.authorization) {
      return res.status(400).json({
        message: "Nenhum Token encontrado",
      });
    }

    const token: string = getToken(req);
    const decoded: any = await jwt.verify(token, secret);
    let currentUser = (await User.findById(decoded.id)) as userInterface;

    if (!currentUser) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }
    // Converte o mongoose document para objeto JavaScript
    currentUser.password = "";

    currentUser.admin = currentUser._id.toString() === id_admin;

    return res.status(200).json({
      user: currentUser,
      isAdmin: currentUser.admin,
    });
  } catch (error) {
    return res.status(404).json({
      message: "erro ao decodificar o token " + error,
    });
  }
};

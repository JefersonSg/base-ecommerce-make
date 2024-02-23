import { Request, Response } from "express";
import User from "../../db/models/User";
import getUserByToken from "../../shared/helpers/getUserByToken";
import getToken from "../../shared/helpers/getToken";
import "dotenv/config";
import { userInterface } from "./interfaceUser";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const id_admin = process.env.ID_ADMIN ?? "";

export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(422).json({
      message: "O Parametro de id não foi passado na requisção",
    });
  }
  if (!ObjectId.isValid(id)) {
    res.status(422).json({
      message: "ID inválido, usuário não encontrado",
    });
    return;
  }

try {
  const user = (await User.findById(id)) as userInterface;
  const isAdmin = user._id.toString() === id_admin;

  if (!user) {
    res.status(422).json({ message: "Usuário não encontrado!" });
    return;
  }
  user.password = "";
  res.status(200).json({ user, isAdmin: isAdmin });
} catch (error) {
  return res.status(404).json({
    message: 'erro ao buscar usuário' + error
  })
}
};

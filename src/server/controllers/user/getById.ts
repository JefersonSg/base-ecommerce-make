import { type Request, type Response } from "express";
import User from "../../db/models/User";
import "dotenv/config";
import { type userInterface } from "./interfaceUser";
import testeID from "../../shared/helpers/verifyId";
import("dotenv/config");
const IMAGE_URL = process.env.IMAGE_URL;

const idAdmin = process.env.ID_ADMIN ?? "";

export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(422).json({
      message: "O Parametro de id não foi passado na requisção",
    });
  }
  if (!testeID(id)) {
    res.status(422).json({
      message: "ID inválido, usuário não encontrado",
    });
    return;
  }

  try {
    const user = (await User.findById(id)) as userInterface;
    const isAdmin = user._id.toString() === idAdmin;

    if (user.image) {
      user.image = `${IMAGE_URL}/users/${user.image}`;
    }

    if (!user) {
      res.status(422).json({ message: "Usuário não encontrado!" });
      return;
    }
    user.password = "";
    res.status(200).json({ user, isAdmin });
  } catch (error) {
    console.log("erro no getById users", error);
    return res.status(500).json({
      message: "erro no getById users",
      error,
    });
  }
};

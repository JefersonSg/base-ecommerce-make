import { Request, Response } from "express";
import User from "../../db/models/User";
import bcrypt from "bcrypt";
import createUserToken from "../../shared/helpers/createUserToken";
import "dotenv/config";
import { userInterface } from "./interfaceUser";

const id_admin = process.env.ID_ADMIN ?? "";

export const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  // check if user exists
  const user = (await User.findOne({ email: email })) as userInterface;

  if (!user) {
    return res
      .status(422)
      .json({ message: "Não há usuário cadastrado com este e-mail!" });
  }

  // check if password match
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ message: "Senha inválida" });
  }

  await createUserToken(user, req, res);
};

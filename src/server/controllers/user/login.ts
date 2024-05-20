import { type Request, type Response } from "express";
import User from "../../db/models/User";
import bcrypt from "bcrypt";
import createUserToken from "../../shared/helpers/createUserToken";
import "dotenv/config";
import { type userInterface } from "./interfaceUser";

export const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  // check if user exists
  try {
    const user = (await User.findOne({ email })) as userInterface;

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
  } catch (error) {
    console.log("erro no login user", error);
    return res.status(500).json({
      message: "erro no login user",
      error,
    });
  }
};

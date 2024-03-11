import { Request, Response } from "express";
import User from "../../db/models/User";

export const getAll = async (req: Request, res: Response) => {
try {
  let users = await User.find();

  if (!users[0]) {
    res.status(422).json({ message: "nenhum usuario encontrado!" });
    return;
  }

  users.forEach((user) =>{
  user.password = ""
  })

  res.status(200).json({ users });
} catch (error) {
  return res.status(404).json({
    message: 'erro ao buscar usuário', error
  })
}
};
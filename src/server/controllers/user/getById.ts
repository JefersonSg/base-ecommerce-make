import { Request, Response } from "express";
import User from "../../db/models/User";
import getUserByToken from "../../shared/helpers/getUserByToken";
import getToken from "../../shared/helpers/getToken";

interface userToken {
  _id:string;
  name: string;
  surname: string;
  username: string;
  email: string;
  password:string;
  image: string;
}

export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const token = await getToken(req)

  if (token) {
    const userToken = await getUserByToken(res, token) as unknown as userToken

     if (!userToken) {
      res.status(422).json({ message: "Usuário não encontrado!" });
     }
     userToken.password = ''
     return res.status(200).json(  userToken );
  }

  if (!id) {
    res.status(422).json({
      message: 'O Parametro de id não foi passado na requisção'
    })
  }

  const user = await User.findById(id);

  if (!user) {
    res.status(422).json({ message: "Usuário não encontrado!" });
    return;
  }
   user.password = ''
  res.status(200).json({ user });
};

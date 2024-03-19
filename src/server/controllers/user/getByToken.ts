import { Request, Response } from "express";
import getUserByToken from "../../shared/helpers/getUserByToken";
import getToken from "../../shared/helpers/getToken";
import "dotenv/config";
import { userInterface } from "./interfaceUser";
import ('dotenv/config')
const IMAGE_URL = process.env.IMAGE_URL

const id_admin = process.env.ID_ADMIN ?? "";

export const getByToken = async (req: Request, res: Response) => {
  
  try {
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

    userToken.image = `${IMAGE_URL}/users/${userToken.image}`;


    const isAdmin = userToken._id.toString() === id_admin;
    return res.status(200).json({ user: userToken, isAdmin: isAdmin });
  }
  } catch (error) {
    console.log("erro no getByToken user", error)
    return res.status(500).json({
  message: "erro no getByToken user", error
})
  }

};


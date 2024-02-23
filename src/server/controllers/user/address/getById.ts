import { Request, Response } from "express";
import "dotenv/config";
import mongoose from "mongoose";
import AdressModel from "../../../db/models/Adress";
import getToken from "../../../shared/helpers/getToken";
import getUserByToken from "../../../shared/helpers/getUserByToken";
import { userInterface } from "../interfaceUser";
const ObjectId = mongoose.Types.ObjectId;


export const getAdressById = async (req: Request, res: Response) => {

  const token = await getToken(req)

  const User = await getUserByToken(res, token) as unknown as userInterface


  if (!User) {
    res.status(422).json({
      message: "Nenhum usuário encontrado no token",
    });
  }
  if (!ObjectId.isValid(User?._id)) {
    res.status(422).json({
      message: "ID inválido, endereço não encontrado",
    });
    return;
  }

try {
  const adress = await AdressModel.findOne({userId: User._id})

  console.log(adress)

  if (!adress) {
    res.status(422).json({ message: "Endereço não encontrado!" });
    return;
  }
  return res.status(200).json({ adress });
} catch (error) {
  console.log('erro ao buscar endereço', error)
  return res.status(404).json({
    message: 'erro ao buscar endereço' + error
  })
}
};

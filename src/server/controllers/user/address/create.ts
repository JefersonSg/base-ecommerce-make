import { Request, Response } from "express";
import User from "../../../db/models/User";
import AdressModel from "../../../db/models/Adress";
import getUserByToken from "../../../shared/helpers/getUserByToken";
import getToken from "../../../shared/helpers/getToken";
import { userInterface } from "../interfaceUser";

interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  image: string;
  password: string;
}

export const createAdress = async (req: Request, res: Response) => {

  const { cidade, rua, bairro, cep, complemento, referencia, numero } = req.body;

  const { id } = req.params;

  const token = await getToken(req)

  const user = await getUserByToken(res, token) as unknown as userInterface

  if (!user) {
    return res.status(404).json({
      message: 'Nenhum usuário encontrado com o id para registrar o endereço'
    })
  }

  const oldAdress = await AdressModel.find({userId: user?._id})

  if (oldAdress) {
    return res.status(409).json({
      message: 'Usuário ja tem endereço cadastrado'
    })
  }

  console.log(oldAdress)
  try {
    const createAdress = await new AdressModel({
      userId: user._id,
      bairro,
      cep,
      cidade,
      complemento,
      numero,
      referencia,
      rua
    }).save()

    if (!createAdress)
      return res.status(404).json({ message: "Erro ao atualizar" });

    res.json({
      message: "Endereço criado com sucesso!",
      data: createAdress,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

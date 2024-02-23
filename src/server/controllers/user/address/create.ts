import { Request, Response } from "express";
import User from "../../../db/models/User";
import AdressModel from "../../../db/models/Adress";

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

  const user = User.findById(id)

  if (!user) {
    return res.status(404).json({
      message: 'Nenhum usuário encontrado com o id para registrar o endereço'
    })
  }
  
  try {
    const createAdress = new AdressModel({
      userId: id,
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

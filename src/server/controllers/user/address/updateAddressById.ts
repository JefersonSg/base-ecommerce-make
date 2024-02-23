import { Request, Response } from "express";
import User from "../../../db/models/User";
import AdressModel from "../../../db/models/Adress";
import { AdressInterface } from "../../../shared/helpers/Interfaces";

interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  image: string;
  password: string;
}

export const updateAddressById = async (req: Request, res: Response) => {

  const { cidade, rua, bairro, cep, complemento, referencia, numero } = req.body;

  const { adressId } = req.params;

  const adress = await AdressModel.findOne({ _id: adressId })

  if (!adress) {
    return res.status(404).json({
      message: 'Nenhum Endereço encontrado com o id'
    })
  }

  try {
    const createAdress = new AdressModel({
      bairro : bairro ?? adress.bairro,
      cep : cep ?? adress.cep,
      cidade : cidade ?? adress.cidade,
      complemento : complemento ?? adress.complemento,
      numero : numero ?? adress.numero,
      referencia : referencia ?? adress.referencia,
      rua : rua ?? adress.rua ,
      userId: adress.userId
    })
    const newAdress = await AdressModel.findOneAndUpdate({ _id: adressId },createAdress)

    if (!newAdress){
      return res.status(404).json({ message: "Erro ao atualizar o endereço" });
    }

    return res.json({
      message: "Endereço atualizado com sucesso!",
      data: newAdress,
    });
  } catch (error) {
    console.log('erro ao atualizar endereço', error)
    res.status(500).json({ message: error });
  }
};

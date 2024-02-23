import { Request, Response } from "express";
import "dotenv/config";
import mongoose from "mongoose";
import AdressModel from "../../../db/models/Adress";
const ObjectId = mongoose.Types.ObjectId;


export const getAdressById = async (req: Request, res: Response) => {
  const {adressId} = req.params;
  if (!adressId) {
    res.status(422).json({
      message: "O Parametro de id não foi passado na requisção",
    });
  }
  if (!ObjectId.isValid(adressId)) {
    res.status(422).json({
      message: "ID inválido, endereço não encontrado",
    });
    return;
  }

try {
  const adress = await AdressModel.findById(adressId)

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

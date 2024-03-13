import { Request, Response } from "express";
import AddressModel from "../../../db/models/Address";
import getToken from "../../../shared/helpers/getToken";
import getUserByToken from "../../../shared/helpers/getUserByToken";
import { userInterface } from "../interfaceUser";

export const getAddressById = async (req: Request, res: Response) => {
  const token = await getToken(req);
  const User = (await getUserByToken(res, token)) as unknown as userInterface;

  if (!User) {
    res.status(422).json({
      message: "Nenhum usuário encontrado no token",
    });
  }

  try {
    const address = await AddressModel.findOne({ userId: User._id });

    if (!address) {
      res.status(422).json({ message: "Endereço não encontrado!" });
      return;
    }
    return res.status(200).json({ address: address });
  } catch (error) {
    console.log("erro ao buscar endereço", error);
    return res.status(404).json({
      message: "erro ao buscar endereço" + error,
    });
  }
};

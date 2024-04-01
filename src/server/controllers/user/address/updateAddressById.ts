import { Request, Response } from "express";
import AddressModel from "../../../db/models/Address";

export const updateAddressById = async (req: Request, res: Response) => {
  const {
    nome,
    cpf,
    telefone,
    email,
    cidade,
    rua,
    bairro,
    cep,
    complemento,
    referencia,
    numero,
    uf,
  } = req.body;
  const { addressId } = req.params;

  const address = await AddressModel.findOne({ _id: addressId });

  if (!address) {
    return res.status(404).json({
      message: "Nenhum Endereço encontrado com o id",
    });
  }

  try {
    const createAddress = {
      userId: address.userId,
      nome: nome ?? address.nome,
      cpf: cpf ?? address.cpf,
      telefone: telefone ?? address.telefone,
      email: email ?? address.email,
      cep: cep ?? address.cep,
      cidade: cidade ?? address.cidade,
      uf: uf ?? address.uf,
      bairro: bairro ?? address.bairro,
      rua: rua ?? address.rua,
      numero: numero ?? address.numero,
      referencia: referencia ?? address.referencia,
      complemento: complemento ?? address.complemento,
    };

    const newAddress = await AddressModel.findOneAndUpdate(
      { _id: addressId },
      createAddress,
    );

    if (!newAddress) {
      return res.status(404).json({ message: "Erro ao atualizar o endereço" });
    }

    return res.json({
      message: "Endereço atualizado com sucesso!",
      data: newAddress,
    });
  } catch (error) {
    console.log("erro ao atualizar endereço", error);
    res.status(500).json({ message: error });
  }
};

import { type Request, type Response } from 'express';
import AddressModel from '../../../db/models/Address';
import getUserByToken from '../../../shared/helpers/getUserByToken';
import getToken from '../../../shared/helpers/getToken';
import { type userInterface } from '../interfaceUser';

export const createAddress = async (req: Request, res: Response) => {
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
    uf
  } = req.body;

  const token = getToken(req);
  const user = (await getUserByToken(res, token)) as unknown as userInterface;

  if (!user) {
    return res.status(404).json({
      message: 'Nenhum usuário encontrado com o id para registrar o endereço'
    });
  }

  const oldAddress = await AddressModel.find({ userId: user?._id });

  if (oldAddress[0]) {
    return res.status(409).json({
      message: 'Usuário ja tem endereço cadastrado'
    });
  }

  try {
    const createAddress = await new AddressModel({
      userId: user._id,
      nome,
      cpf,
      telefone,
      email,
      cep,
      cidade,
      uf,
      bairro,
      rua,
      numero,
      referencia,
      complemento
    }).save();

    if (!createAddress)
      return res.status(404).json({ message: 'Erro ao atualizar' });

    res.json({
      message: 'Endereço criado com sucesso!',
      data: createAddress
    });
  } catch (error) {
    console.log('erro no create Adress', error);
    return res.status(500).json({
      message: 'erro no create Adress',
      error
    });
  }
};

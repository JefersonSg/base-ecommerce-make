import { type Request, type Response } from 'express';
import { CuponsModel } from '../../db/models/Cupons';
import CuponsUsed from '../../db/models/CuponsUsed';
import getToken from '../../shared/helpers/getToken';
import getUserByToken from '../../shared/helpers/getUserByToken';
import { type userInterface } from '../user/interfaceUser';

export const redeemCupom = async (req: Request, res: Response) => {
  const { code, valorDaCompra } = req.body;

  const token = getToken(req);
  const user = (await getUserByToken(res, token)) as userInterface;
  const hoje = new Date();

  try {
    if (!code) {
      return res.status(403).json({
        erro: 'Insira o código co cupom'
      });
    }

    const checkCode = await CuponsModel.findOne({ code });

    if (!checkCode || !checkCode.active) {
      return res.status(400).json({ erro: 'Cupom inválido ou inativo.' });
    }
    const [alreadyUsed] = await CuponsUsed.find({
      code,
      userId: user._id,
      idCupom: checkCode._id
    });
    if (alreadyUsed) {
      return res.status(400).json({ erro: 'Você já utilizou este cupom.' });
    }
    if (checkCode.expiration && checkCode.expiration < hoje) {
      return res.status(400).json({
        erro: 'Este cupom expirou'
      });
    }
    if (checkCode.limitUses && checkCode.uses >= checkCode?.limitUses) {
      return res.status(400).json({
        erro: 'Limite de uso do cupom atingido'
      });
    }

    if (checkCode.minimumValue && checkCode.minimumValue > valorDaCompra) {
      return res.status(400).json({
        erro: `É necessário um valor mínimo de R$ ${checkCode.minimumValue.toFixed(
          2
        )}`
      });
    }
    return res.status(200).json({
      cupom: checkCode
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      erro: 'erro ao resgatar o cupom',
      error
    });
  }
};

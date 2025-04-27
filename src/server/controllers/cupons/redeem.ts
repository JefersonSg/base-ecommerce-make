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
        erro: 'faltam dados para o resgate, code'
      });
    }

    const checkCode = await CuponsModel.findOne({ code });

    const checkIfAlreadyUsed = await CuponsUsed.find({
      code,
      userId: user._id,
      idCupom: checkCode?._id
    });

    if (!checkCode) {
      return res.status(500).json({
        erro: 'Este cupom não existe'
      });
    }

    if (!checkCode.active) {
      return res.status(500).json({
        erro: 'Este cupom não existe'
      });
    }
    if (checkIfAlreadyUsed?.[0]) {
      return res.status(500).json({
        erro: 'Você já usou esse cupom'
      });
    }
    if (checkCode?.expiration && checkCode.expiration < hoje) {
      return res.status(400).json({
        erro: 'Cupom expirado'
      });
    }
    if (checkCode?.limitUses && checkCode.uses >= checkCode?.limitUses) {
      return res.status(500).json({
        erro: 'Cupons esgotados'
      });
    }

    if (checkCode.minimumValue && checkCode.minimumValue > valorDaCompra) {
      return res.status(400).json({
        erro: 'Você não atingiu o valor mínimo para usar este cupom'
      });
    }
    return res.status(200).json({
      cupom: checkCode
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      erro: 'erro ao resgatar o cupom',
      error
    });
  }
};

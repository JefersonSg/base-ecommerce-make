import { type Request, type Response } from 'express';
import { CuponsModel } from '../../db/models/Cupons';

export const createCoupon = async (req: Request, res: Response) => {
  const {
    code,
    expiration,
    limitUses,
    percentageDiscount,
    valueFixDiscount,
    minimumValue,
    active
  } = req.body;

  if (valueFixDiscount && percentageDiscount) {
    return res.status(400).json({
      error: 'o valor minimo ou percentual deve ser inserido'
    });
  }

  const codeInUse = await CuponsModel.find({ code });

  if (codeInUse?.[0]) {
    return res.status(402).json({
      erro: 'Código de cupom já em uso'
    });
  }
  const cupomDate = new CuponsModel({
    code,
    expiration,
    limitUses,
    percentageDiscount,
    valueFixDiscount,
    minimumValue,
    active
  });

  try {
    const newCupom = await cupomDate.save();
    return res.status(200).json({
      message: 'cupom criado com sucesso',
      newCupom
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: 'erro no no cupom create',
      error
    });
  }
};

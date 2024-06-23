import { type Request, type Response } from 'express';
import { CuponsModel } from '../../db/models/Cupons';

export const getAllCupons = async (req: Request, res: Response) => {
  try {
    const cupons = await CuponsModel.find();

    res.status(200).json({
      cupons
    });
  } catch (error) {
    res.status(500).json({
      erro: 'erro ao buscar os cupons',
      error
    });
  }
};

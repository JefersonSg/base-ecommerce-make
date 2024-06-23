import { type Request, type Response } from 'express';
import { CuponsModel } from '../../db/models/Cupons';

export const deleteCupom = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(402).json({
      error: 'o id do cupom deve ser informado'
    });
  }

  try {
    const cupomDate = await CuponsModel.findByIdAndRemove(id);

    return res.status(200).json({
      message: 'cupom removido com sucesso',
      cupomDate
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: 'erro no no cupom create',
      error
    });
  }
};

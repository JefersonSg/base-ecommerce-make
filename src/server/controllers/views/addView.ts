import { type Request, type Response } from 'express';
import Product from '../../db/models/Product';
import testeID from '../../shared/helpers/verifyId';
import getUserByToken from '../../shared/helpers/getUserByToken';
import { type userInterface } from '../user/interfaceUser';
import ViewsModel from '../../db/models/Views';
import { toZonedTime } from 'date-fns-tz';

export const addView = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  const { userToken, sessionId, pageView } = req.body;

  const timeZone = 'America/Sao_Paulo';

  // Criar a data com o fuso horário de Brasília
  const now = new Date();
  const zonedDate = toZonedTime(now, timeZone);

  const user = (await getUserByToken(
    res,
    userToken
  )) as unknown as userInterface;

  const testeId = testeID(productId);

  if (productId && !testeId) {
    return res.status(401).json({
      message: 'Id do produto e invalido'
    });
  }
  const product = productId && (await Product.findById(productId));

  if (productId && !product) {
    return res.status(404).json({
      message:
        'nao e possível add nova view,  produto nao encontrado com esse id'
    });
  }
  try {
    const newView = await new ViewsModel({
      product: productId ?? null,
      userId: user._id ?? null,
      date: zonedDate,
      sessionId,
      pageView: pageView ?? null
    }).save();

    return res.status(200).json({
      message: 'view salvo com sucesso',
      newView
    });
  } catch (error) {
    console.log('erro ao adicionar view', error);
    return res.status(500).json({ message: error });
  }
};

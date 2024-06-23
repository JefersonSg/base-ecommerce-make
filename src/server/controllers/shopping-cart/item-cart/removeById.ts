import { type Request, type Response } from 'express';
import ItemCart from '../../../db/models/ItemCart';
import mongoose from 'mongoose';

export const removeItemCartById = async (req: Request, res: Response) => {
  const { itemId } = req.params;

  const object = mongoose.Types.ObjectId;

  if (!object.isValid(itemId)) {
    return res.status(404).json({
      message: 'ID do params invalido'
    });
  }

  try {
    const itemRemoved = await ItemCart.findByIdAndDelete(itemId);

    if (!itemRemoved) {
      return res.status(404).json({
        message: 'nenhum item encontrado com esse ID'
      });
    }

    return res
      .status(200)
      .json({ message: 'Item removido do carrinho com sucesso', itemRemoved });
  } catch (error) {
    console.error('Erro ao adicionar item ao carrinho:', error);
    return res
      .status(500)
      .json({ error: 'Ocorreu um erro ao processar a solicitação' });
  }
};

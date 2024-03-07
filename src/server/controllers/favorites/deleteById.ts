import { Request, Response } from "express";

import FavoriteModel from "../../db/models/Favorite";
import testeID from "../../shared/helpers/verifyId";

export const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const isValidId = testeID(id)

  if (!isValidId) {
    res.status(422).json({ message: "ID inválido!" });
    return;
  }

  const Favorite = await FavoriteModel.findOne({ _id: id });

  if (!Favorite) {
    res.status(404).json({ message: "Nenhum Favorito encontrado com esse ID!" });
    return;
  }

  try {

    await FavoriteModel.findByIdAndRemove(id);
    return res.status(200).json({ message: "Favorito removido com sucesso!" });

  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: 'erro ao fazer o delete' + error
    })
  }
};

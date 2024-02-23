import { Request, Response } from "express";

import mongoose from "mongoose";
import { removeImageS3 } from "../../shared/helpers/imageUpload";
import BannersModel from "../../db/models/Banner";
const ObjectId = mongoose.Types.ObjectId;

export const deleteBanner = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.status(422).json({ message: "ID inválido!" });
    return;
  }

  const Banner = await BannersModel.findOne({ _id: id });
  if (!Banner) {
    res.status(404).json({ message: "Nenhum Banner encontrado com esse ID!" });
    return;
  }

  try {
    if (Banner.images)  {
      for (const image of Banner?.images) {
        await removeImageS3("banners", image);
      }
    }
    await BannersModel.findByIdAndRemove(id);

    res.status(200).json({ message: "Banner removido com sucesso!" });
  } catch (erro) {
    console.log(erro);
  }
};

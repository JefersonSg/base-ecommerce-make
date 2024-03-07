import { Request, Response } from "express";

import { removeImageS3 } from "../../shared/helpers/imageUpload";
import BannersModel from "../../db/models/Banner";
import testeID from "../../shared/helpers/verifyId";

export const deleteBanner = async (req: Request, res: Response) => {
  const id = req.params.id;

  const isValid = testeID(id)

  if (!isValid) {
    res.status(422).json({ message: "ID inválido!" });
    return;
  }

  const Banner = await BannersModel.findOne({ _id: id });
  if (!Banner) {
    res.status(404).json({ message: "Nenhum Banner encontrado com esse ID!" });
    return;
  }

  try {
    if (Banner.imageDesktop || Banner.imageMobile)  {
        await removeImageS3("banners", Banner.imageMobile);
        await removeImageS3("banners", Banner.imageDesktop);
    }
    await BannersModel.findByIdAndRemove(id);

    res.status(200).json({ message: "Banner removido com sucesso!" });
  } catch (erro) {
    console.log(erro);
  }
};

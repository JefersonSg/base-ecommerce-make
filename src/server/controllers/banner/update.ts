import { Request, Response } from "express";

import { removeImageS3, uploadToS3 } from "../../shared/helpers/imageUpload";
import BannersModel from "../../db/models/Banner";
import { BannerInterface } from "../../shared/helpers/Interfaces";
import testeID from "../../shared/helpers/verifyId";
import { verifySizeImage } from "../../shared/helpers/verifySize";
import { verifyMimetypeImage } from "../../shared/helpers/verifyMimetype";

export const updateBanner = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, link, active, mobile, desktop } = req.body;
  const images: any = req.files;
  const updateData: BannerInterface | any = {
    name,
    link,
    active,
  };

  const isValidId = testeID(id);

  if (!isValidId) {
    res.status(422).json({
      message: "ID inválido, Banner não encontrada",
    });
    return;
  }

  const banner = await BannersModel.findById(id);

  if (!banner) {
    res.status(422).json({
      message: "Nenhum banner encontrado no BD",
    });
    return;
  }

  if (images?.length > 2) {
    res.status(422).json({
      message:
        "Maximo de imagens excedidas, envie uma para Desktok e uma para Mobile",
    });
    return;
  }

  try {
    if (verifySizeImage(images)) {
      return res.status(401).json({
        message : verifySizeImage(images)
      })
    }

    if (verifyMimetypeImage(images)) {
      return res.status(401).json({
        message : verifyMimetypeImage(images)
      })
    }

    if (images?.length > 0) {
      async function uploads() {
        // Use `map` with `Promise.all` to await for all uploads to complete
        await Promise.all(
          images?.map(async (image: any, index: number) => {
            const data = await uploadToS3("banners", image);
            image.filename = data;
          }),
        );
      }

      await uploads();

      if (images?.[0] && mobile !== "undefined") {
        updateData.imageMobile = images[0].filename;
        await removeImageS3("banners", banner.imageMobile);
      }

      if (images?.[1] && desktop !== "undefined") {
        updateData.imageDesktop = images?.[1]?.filename;
        await removeImageS3("banners", banner.imageDesktop);
      }

      if (images?.[0] && desktop !== "undefined" && mobile === "undefined") {
        updateData.imageDesktop = images?.[0]?.filename;
        await removeImageS3("banners", banner.imageDesktop);
      }
    }

    const newBanner = await BannersModel.findByIdAndUpdate(id, updateData);

    return res
      .status(200)
      .json({ message: "Banner atualizado com sucesso!", newBanner });
  } catch (error) {
    console.log("erro no update banner", error);
    return res.status(500).json({
      message: "erro no update banner",
      error,
    });
  }
};

import { Request, Response } from "express";
import Category from "../../db/models/Category";

import mongoose from "mongoose";
import {
  removeImageS3,
  uploadToS3,
} from "../../shared/helpers/imageUpload";
import BannersModel from "../../db/models/Banner";
import { BannerInterface } from "../../shared/helpers/Interfaces";
const ObjectId = mongoose.Types.ObjectId;



export const updateBanner = async (req: Request, res: Response) => {
  const id = req.params.id;
  const {name, link, active} = req.body;

  const images: any = req.files;

  const updateData: BannerInterface | any = {
    name, link, active
  };

  if (!ObjectId.isValid(id)) {
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

    if (images?.length === 1) {
      res.status(422).json({
        message: "São necessárias duas imagens, uma para Desktop e uma para Mobile",
      });
      return;
    }
  
    if (images?.length > 2) {
      res.status(422).json({
        message: "Maximo de imagens excedidas, envie uma para Desktok e uma para Mobile",
      });
      return;
    }

try {
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
    updateData.images = [];

    await uploads();

    images.map((image: any) => {
      updateData.images.push(image.filename);
    });

    banner.images.forEach((image) => {
      removeImageS3("banners", image);
    });
  }

  const newBanner = await BannersModel.findByIdAndUpdate(id, updateData);

return res
  .status(200)
  .json({message: "Banner atualizado com sucesso!" ,  newBanner});
} catch (error) {
  return res.status(401).json({
    message: 'erro ao atualizar' + error
  })
}
};

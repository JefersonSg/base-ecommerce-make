import { Request, Response } from "express";
import BannersModel from "../../db/models/Banner";
import { BannerInterface } from "../../shared/helpers/Interfaces";

import ('dotenv/config')

const IMAGE_URL = process.env.IMAGE_URL

export const getAllActives = async (req: Request, res: Response) => {
  const banners = (await BannersModel.find({ active: true }).sort(
    "-createdAt",
  )) as unknown as BannerInterface[];

  if (!banners) {
    res.status(422).json({
      message: "Nenhuma categoria foi encontrada",
    });
    return;
  }

  for (const banner of banners) {

    banner.imageMobile = `${IMAGE_URL}/banners/${banner?.imageMobile}`;
    banner.imageDesktop = `${IMAGE_URL}/banners/${banner?.imageDesktop}`;
  }

  try {
    res.status(200).json({
      banners,
    });
    return;
  } catch (error) {
    console.log("erro no getAllActives banner", error);
    return res.status(500).json({
      message: "erro no getAllActives banner",
      error,
    });
  }
};

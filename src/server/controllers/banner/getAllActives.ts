import { Request, Response } from "express";
import Category from "../../db/models/Category";
import getUrlImageS3 from "../../shared/helpers/getUrlImageS3";
import BannersModel from "../../db/models/Banner";
import { BannerInterface } from "../../shared/helpers/Interfaces";

export const getAllActives = async (req: Request, res: Response) => {
  const banners = (await BannersModel.find({active: true}).sort("-createdAt")) as unknown as BannerInterface[];

  if (!banners) {
    res.status(422).json({
      message: "Nenhuma categoria foi encontrada",
    });
    return;
  }

  for (const banner of banners) {
      const url1 = await getUrlImageS3("banners", banner?.imageMobile);
      const url2 = await getUrlImageS3("banners", banner?.imageDesktop);

      banner.imageMobile= url1 ?? "";
      banner.imageDesktop= url2 ?? "";
  }

  try {
    res.status(200).json({
        banners,
    });
    return;
  } catch (erro) {
    res.status(500).json({ message: erro });
    return;
  }
};

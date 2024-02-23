import { Request, Response } from "express";
import Category from "../../db/models/Category";
import getUrlImageS3 from "../../shared/helpers/getUrlImageS3";
import BannersModel from "../../db/models/Banner";



interface Banner {
  name: string;
  link: string;
  images: string[];
}

export const getAll = async (req: Request, res: Response) => {
  const banners = (await BannersModel.find().sort("-createdAt")) as unknown as Banner[];

  if (!banners) {
    res.status(422).json({
      message: "Nenhuma categoria foi encontrada",
    });
    return;
  }

  for (const banner of banners) {
    for (let i = 0; i < banner?.images?.length; i++) {
      const url = await getUrlImageS3("banners", banner?.images[i]);

      banner.images[i] = url ?? "";
    }
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

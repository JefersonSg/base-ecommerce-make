import { Request, Response } from "express";
import { uploadToS3 } from "../../shared/helpers/imageUpload";
import BannersModel from "../../db/models/Banner";
import { BannerInterface } from "../../shared/helpers/Interfaces";

export const create = async (req: Request, res: Response) => {
  const {name, link, active} = req.body;
  const images: any = req.files;

  if (images && images.length === 0) {
    res.status(422).json({
      message: "A imagem é obrigatoria",
    });
    return;
  }
  
  if (images && images.length === 1) {
    res.status(422).json({
      message: "São necessárias duas imagens, uma para Desktop e uma para Mobile",
    });
    return;
  }

  if (images && images.length > 2) {
    res.status(422).json({
      message: "Maximo de imagens excedidas, envie uma para Desktok e uma para Mobile",
    });
    return;
  }


  async function uploads() {
    // Use `map` with `Promise.all` to wait for all uploads to complete
    await Promise.all(
      images?.map(async (image: any) => {
        const Image = await uploadToS3("banners", image);
        image.filename = Image;
      }),
    );
  }

const Banner = new BannersModel(
    {
      name,
      link,
      active,
      images: [],
    }
  );
    await uploads()

    await images?.map((image: any) => {
      Banner?.images?.push(image?.filename);
    });

  try {
    const newBanner = await Banner.save();
    res.status(200).json({
      message: "Banner criado com sucesso",
      newBanner,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

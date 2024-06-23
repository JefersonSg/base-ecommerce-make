import { type Request, type Response } from 'express';
import { uploadToS3 } from '../../shared/helpers/imageUpload';
import BannersModel from '../../db/models/Banner';
import { verifySizeImage } from '../../shared/helpers/verifySize';
import { verifyMimetypeImage } from '../../shared/helpers/verifyMimetype';

export const create = async (req: Request, res: Response) => {
  const { name, link, active } = req.body;
  const images: any = req.files;

  if (images?.length === 0) {
    res.status(422).json({
      message: 'A imagem é obrigatoria'
    });
    return;
  }

  if (images && images.length === 1) {
    res.status(422).json({
      message:
        'São necessárias duas imagens, uma para Desktop e uma para Mobile'
    });
    return;
  }

  if (images && images.length > 2) {
    res.status(422).json({
      message:
        'Maximo de imagens excedidas, envie uma para Desktok e uma para Mobile'
    });
    return;
  }
  if (verifySizeImage(images)) {
    return res.status(401).json({
      message: verifySizeImage(images)
    });
  }

  if (verifyMimetypeImage(images)) {
    return res.status(401).json({
      message: verifyMimetypeImage(images)
    });
  }

  async function uploads() {
    // Use `map` with `Promise.all` to wait for all uploads to complete
    await Promise.all(
      images?.map(async (image: any) => {
        const Image = await uploadToS3('banners', image);
        image.filename = Image;
      })
    );
  }

  await uploads();

  const Banner = new BannersModel({
    name,
    link,
    active,
    imageMobile: images?.[0]?.filename,
    imageDesktop: images?.[1]?.filename
  });

  try {
    const newBanner = await Banner.save();
    res.status(200).json({
      message: 'Banner criado com sucesso',
      newBanner
    });
  } catch (error) {
    console.log('erro no create banner', error);
    return res.status(500).json({
      message: 'erro no create banner',
      error
    });
  }
};

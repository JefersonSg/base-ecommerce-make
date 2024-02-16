import { Request, Response } from "express";
import Category from "../../db/models/Category";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import getUrlImageS3 from "../../shared/helpers/getUrlImageS3";

const bucketName = process.env.BUCKET_NAME ?? "";
const bucketRegion = process.env.BUCKET_REGION ?? "";
const secretAcessKey = process.env.SECRET_ACESS_KEY ?? "";
const acessKey = process.env.ACESS_KEY ?? "";

interface category {
  name: string;
  description: string;
  image: string;
}

export const getAll = async (req: Request, res: Response) => {
  const categories = (await Category.find().sort("-createdAt")) as category[];

  if (!categories) {
    res.status(422).json({
      message: "Nenhuma categoria foi encontrada",
    });
    return;
  }
  for (const category of categories) {
    const url = await getUrlImageS3("category", category.image);

    category.image = url ?? "";
  }

  try {
    res.status(200).json({
      categories,
    });
    return;
  } catch (erro) {
    res.status(500).json({ message: erro });
    return;
  }
};

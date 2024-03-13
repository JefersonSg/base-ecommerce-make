import { Request, Response } from "express";
import Category from "../../db/models/Category";
import getUrlImageS3 from "../../shared/helpers/getUrlImageS3";


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
  } catch (error) {
    console.log("erro no getAll categories", error)
return res.status(500).json({
  message: "erro no getAll categories", error
})
  }
};

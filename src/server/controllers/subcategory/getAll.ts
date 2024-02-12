import { Request, Response } from "express";
import getUrlImageS3 from "../../shared/helpers/getUrlImageS3";
import SubcategoryModel from "../../db/models/Subcategory";


interface SubcategoryInterface {
  name: string;
  description: string;
  category: string;
  image: string;
}



export const getAll = async (req: Request, res: Response) => {
  const subcategories  = await SubcategoryModel.find().sort("-createdAt") as SubcategoryInterface[];

  if (!subcategories) {
    res.status(422).json({
      message: "Nenhuma subcategoria foi encontrada",
    });
    return;
  }

for (const subcategory of subcategories) {

  const url = await getUrlImageS3('subcategory',subcategory.image)

  if (!subcategory?.image) {
    return
  }
  subcategory.image = url ?? ''
}

  try {
    res.status(200).json({
      subcategories,
    });
    return;
  } catch (erro) {
    res.status(500).json({ message: erro });
    return;
  }
};

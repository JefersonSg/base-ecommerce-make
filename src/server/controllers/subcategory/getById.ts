import { Request, Response } from "express";

import getUrlImageS3 from "../../shared/helpers/getUrlImageS3";
import SubcategoryModel from "../../db/models/Subcategory";
import testeID from "../../shared/helpers/verifyId";

export const getById = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!testeID(id)) {
    res.status(422).json({
      message: "ID inválido, Subcategoria não encontrada",
    });
    return;
  }

try {  const subcategory = await SubcategoryModel.findById(id);

  if (!subcategory) {
    res.status(422).json({
      message: "subcategoria não encontrada",
    });
    return;
  }

  if (!subcategory.image) return res.status(200).json({ subcategory });

    const url = await getUrlImageS3("subcategory", subcategory?.image);
    
    subcategory.image = url ?? '';

  res.status(200).json({
    subcategory,
  });
  
} catch (error) {
  res.status(400).json({
    message: "erro no get subcategory by id " + error
  })
}
};

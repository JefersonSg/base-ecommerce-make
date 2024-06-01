import { type Request, type Response } from "express";
import ViewsModel from "../../db/models/Views";

export const getAllProductsViews = async (req: Request, res: Response) => {
  try {
    const totalViews = await ViewsModel.aggregate([
      {
        $group: {
          _id: "$product",
          viewsCount: { $sum: 1 },
        },
      },
      {
        $sort: { viewsCount: -1 },
      },
    ]);
    return res.status(200).json({
      totalViews,
    });
  } catch (error) {
    console.error("Erro ao buscar visualizações:", error);

    return res.status(500).json({
      message: "erro ao buscar vizualicacoes",
      error,
    });
  }
};

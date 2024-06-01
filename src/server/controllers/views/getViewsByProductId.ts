import { type Request, type Response } from "express";
import testeID from "../../shared/helpers/verifyId";
import ViewsModel from "../../db/models/Views";

export const getViewsByProductId = async (req: Request, res: Response) => {
  const productId = req.params.productId;

  const testeId = testeID(productId);

  if (!testeId) {
    return res.status(401).json({
      message: "Id do produto e invalido",
    });
  }
  try {
    try {
      const totalViews = await ViewsModel.aggregate([
        {
          $match: {
            product: productId,
          },
        },
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
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

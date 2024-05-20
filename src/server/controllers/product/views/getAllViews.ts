import { type Request, type Response } from "express";
import ViewsModel from "../../../db/models/Views";

export const getAllViews = async (req: Request, res: Response) => {
  const hoje = new Date(); // Data de hoje
  const inicioDoDia = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate(),
  ); // Define a hora 00:00:00 de hoje
  const fimDoDia = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate(),
    23,
    59,
    59,
  );
  try {
    try {
      const totalViews = await ViewsModel.aggregate([
        {
          $match: {
            createdAt: { $gte: inicioDoDia, $lte: fimDoDia },
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
      const ips = await ViewsModel.aggregate([
        {
          $match: {
            createdAt: { $gte: inicioDoDia, $lte: fimDoDia },
          },
        },
        {
          $group: {
            _id: { ip: "$ip", product: "$product" },
            userId: { $addToSet: "$userId" },
            visitCount: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.ip",
            user: { $addToSet: "$userId" },
            products: {
              $push: {
                productId: "$_id.product",
                count: "$visitCount",
              },
            },
            numberVisit: { $sum: "$visitCount" },
          },
        },
        {
          $addFields: {
            user: {
              $reduce: {
                input: "$user",
                initialValue: [],
                in: {
                  $concatArrays: [
                    "$$value",
                    {
                      $filter: {
                        input: "$$this",
                        as: "userId",
                        cond: { $ne: ["$$userId", null] },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]);

      return res.status(200).json({
        totalViews,
        ips,
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

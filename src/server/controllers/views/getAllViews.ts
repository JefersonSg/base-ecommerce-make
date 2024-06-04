import { type Request, type Response } from "express";
import ViewsModel from "../../db/models/Views";
import { sub } from "date-fns";

export const getAllViews = async (req: Request, res: Response) => {
  const today = new Date();

  const { daysAgo } = req.params;

  today.setHours(0, 0, 0, 0);

  const DaysAgo = sub(today, { days: Number(daysAgo) ?? 0 });

    try {
      const totalViews = await ViewsModel.aggregate([
        {
          $match: {
            date: { $gte: DaysAgo },
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

      const sessions = await ViewsModel.aggregate([
        {
          $match: {
            date: { $gte: DaysAgo },
          },
        },
        {
          $group: {
            _id: { sessionId: "$sessionId", product: "$product" },
            userId: { $addToSet: "$userId" },
            visitCount: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.sessionId",
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
        sessions,
      });
    } catch (error) {
      console.error("Erro ao buscar visualizações:", error);

      return res.status(500).json({
        message: "erro ao buscar vizualicacoes",
        error,
      });
    }

};

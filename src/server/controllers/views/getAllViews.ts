import { type Request, type Response } from "express";
import ViewsModel from "../../db/models/Views";
import { sub } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import 'dotenv/config'
import mongoose from "mongoose";


interface TotalViewsInterface {
  _id: string;
  userId: string[] | null;
  viewsCount: number;
  pageView: string[];
}
interface SessionsInterface {
  _id: string;
  user: string[] | null,
  products: {productId: string, count: number}[],
  pageView: string[],
  numberVisit: number
}

export const getAllViews = async (req: Request, res: Response) => {

  const idAdmin = process.env.ID_ADMIN ?? '';

  const timeZone = "America/Sao_Paulo";
  const now = new Date();
  const todayBrType = toZonedTime(now, timeZone);
  const { daysAgo } = req.params;
  todayBrType.setHours(0, 0, 0, 0);
  const DaysAgo = sub(todayBrType, { days: Number(daysAgo) ?? 0 });

    try {
      const newtotalViews = await ViewsModel.aggregate([
        {
          $match: {
            date: { $gte: DaysAgo }
          },
        },
        {
          $group: {
            _id: "$product",
            userId: { $addToSet: "$userId" },
            pageView: { $addToSet: "$pageView" },
            viewsCount: { $sum: 1 },
          },
        },
        {
          $sort: { viewsCount: -1 },
        },
      ]);

      const getsessions = await ViewsModel.aggregate([
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
            pageView: {$addToSet: '$pageView'},
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
            pageView: {$addToSet: '$pageView'},
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

      const sessions = getsessions.filter((session: SessionsInterface)=> session?.user?.toString() !== idAdmin)

      
      const totalViews = newtotalViews.map((view: TotalViewsInterface)=>{return ({
          _id: view._id,
          userId: view?.userId?.filter((user: string | null)=> user !== null),
          viewsCount: view.viewsCount,
          pageView: view.pageView
      })}).filter((view)=> view.userId?.[0]?.toString() !== idAdmin)



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

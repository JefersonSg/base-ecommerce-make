import { type Request, type Response } from 'express';
import ViewsModel from '../../db/models/Views';
import { sub } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import 'dotenv/config';
import mongoose from 'mongoose';

export const getAllViews = async (req: Request, res: Response) => {
  const idAdmin = new mongoose.Types.ObjectId(
    process.env.ID_ADMIN ?? '681c1a735842bd4a1d99f75a'
  );
  const timeZone = 'America/Sao_Paulo';
  const now = new Date();
  const todayBrType = toZonedTime(now, timeZone);
  todayBrType.setHours(0, 0, 0, 0);

  const { daysAgo } = req.params;
  const MAX_DAYS = 60;
  const safeDays = Math.min(Number(daysAgo) || 7, MAX_DAYS);

  const DaysAgo = sub(todayBrType, { days: safeDays });

  try {
    // ------------------------
    // 1. Produtos mais vistos
    // ------------------------
    const newTotalViewsProduct = await ViewsModel.aggregate(
      [
        {
          $match: {
            date: { $gte: DaysAgo },
            product: { $ne: null },
            userId: { $ne: idAdmin } // 👈 filtrando logo aqui
          }
        },
        {
          $group: {
            _id: '$product',
            viewsCount: { $sum: 1 }
          }
        },
        {
          $sort: { viewsCount: -1 }
        },
        {
          $limit: 10
        },
        {
          $project: {
            _id: 0,
            idProduct: '$_id',
            viewsCount: 1
          }
        }
      ],
      { allowDiskUse: true }
    ); // fallback para grandes volumes

    // -------------------------------
    // 2. Sessões de navegação limpas
    // -------------------------------
    const sessionNavigations = await ViewsModel.aggregate(
      [
        {
          $match: {
            date: { $gte: DaysAgo },
            sessionId: { $ne: null },
            product: { $ne: null },
            userId: { $ne: idAdmin }
          }
        },
        {
          $group: {
            _id: {
              sessionId: '$sessionId',
              product: '$product',
              page: '$pageView',
              userId: '$userId'
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: '$_id.sessionId',
            userId: { $first: '$_id.userId' },
            numberVisit: { $sum: '$count' },
            pages: { $addToSet: '$_id.page' },
            products: {
              $push: {
                productId: '$_id.product',
                count: '$count'
              }
            }
          }
        },
        {
          $sort: { numberVisit: -1 }
        }
      ],
      { allowDiskUse: true }
    );

    return res.status(200).json({
      totalViews: newTotalViewsProduct,
      sessions: sessionNavigations
    });
  } catch (error) {
    console.error('Erro ao buscar visualizações:', error);
    return res.status(500).json({
      message: 'erro ao buscar visualizações',
      error
    });
  }
};

import { type Request, type Response } from 'express';
import ViewsModel from '../../db/models/Views';
import { sub } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import 'dotenv/config';

interface TotalViewsInterface {
  _id: string;
  userId: string[] | null;
  viewsCount: number;
}
interface UserNavigationInterface {
  _id: string;
  user: string[] | null;
  products: { productId: string; count: number }[];
  pageView: string[];
  numberVisit: number;
}

export const getAllViews = async (req: Request, res: Response) => {
  const idAdmin = process.env.ID_ADMIN ?? '';

  const timeZone = 'America/Sao_Paulo';
  const now = new Date();
  const todayBrType = toZonedTime(now, timeZone);
  const { daysAgo } = req.params;
  todayBrType.setHours(0, 0, 0, 0);
  const DaysAgo = sub(todayBrType, { days: Number(daysAgo) ?? 0 });

  try {
    const newtotalViewsProduct = await ViewsModel.aggregate([
      {
        $match: {
          date: { $gte: DaysAgo }
        }
      },
      {
        $group: {
          _id: '$product',
          userId: { $addToSet: '$userId' },
          viewsCount: { $sum: 1 }
        }
      },
      {
        $sort: { viewsCount: -1 }
      }
    ]);

    const userNavigations = await ViewsModel.aggregate([
      {
        $match: {
          date: { $gte: DaysAgo }
        }
      },
      {
        $group: {
          _id: {
            sessionId: '$sessionId',
            page: '$pageView',
            product: '$product'
          },
          userId: { $addToSet: '$userId' },
          visitCount: { $sum: 1 },
          pageView: { $addToSet: '$pageView' }
        }
      },
      {
        $group: {
          _id: '$_id.sessionId',
          user: { $addToSet: '$userId' },
          products: {
            $push: {
              productId: '$_id.product',
              count: '$visitCount'
            }
          },
          pageViews: {
            $push: {
              page: '$_id.page',
              count: '$visitCount'
            }
          },
          numberVisit: { $sum: '$visitCount' }
        }
      },
      {
        $addFields: {
          user: {
            $reduce: {
              input: '$user',
              initialValue: [],
              in: {
                $concatArrays: [
                  '$$value',
                  {
                    $filter: {
                      input: '$$this',
                      as: 'userId',
                      cond: { $ne: ['$$userId', null] }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $sort: { numberVisit: -1 }
      }
    ]);

    const sessions = userNavigations.filter(
      (navigation: UserNavigationInterface) =>
        navigation?.user?.toString() !== idAdmin
    );

    const totalViews = newtotalViewsProduct
      .map((view: TotalViewsInterface) => {
        return {
          _id: view._id,
          userId: view?.userId?.filter(
            (user: string | null) =>
              user?.toString() === idAdmin || user !== null
          ),
          viewsCount: view.viewsCount
        };
      })
      .filter((view) => view.userId?.[0]?.toString() !== idAdmin)
      .filter((view) => view._id !== null);

    return res.status(200).json({
      totalViews,
      sessions
    });
  } catch (error) {
    console.error('Erro ao buscar visualizações:', error);

    return res.status(500).json({
      message: 'erro ao buscar vizualicacoes',
      error
    });
  }
};

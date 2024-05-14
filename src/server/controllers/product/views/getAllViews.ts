import { Request, Response } from "express";
import testeID from "../../../shared/helpers/verifyId";
import ViewsModel from "../../../db/models/Views";

export const getAllViews = async (req: Request, res: Response) => {
    const hoje = new Date(); // Data de hoje
    const inicioDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()); // Define a hora 00:00:00 de hoje
    const fimDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59);
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
              _id: "$ip",
              numberVisit: {$sum: 1}
            }
          }
        ])
  
        return res.status(200).json({
          totalViews, ips
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

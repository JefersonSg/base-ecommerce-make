import { Request, Response } from "express";
import User from "../../db/models/User";
import getToken from "../../shared/helpers/getToken";
import jwt from "jsonwebtoken";
import "dotenv/config";

const secret = process.env.SECRET_JWT || "";

export const checkUser = async (req: Request, res: Response) => {
  let currentUser: any;

  try {
    
    if (!req.headers.authorization) {
      return res.status(400).json({
        message: "Nenhum Token encontrado",
      });
    }
    
    const token: string = getToken(req);
    const decoded: any = await jwt.verify(token, secret);
      currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        return res.status(404).json({
          message: "Usuário não encontrado",
        });
      }

      currentUser = currentUser.toObject(); // Converte o mongoose document para objeto JavaScript
      delete currentUser.password;

      return res.status(200).json({
        currentUser,
      });
    } catch (error) {
      return res.status(404).json({
        message: "erro ao decodificar o token " + error,
      });
    }
  } 
   

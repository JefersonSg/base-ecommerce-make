import jwt from "jsonwebtoken";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";

interface Verifies {
  name: string,
   id: string
}
// middleware to validate token
const checkAdminToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) return res.status(401).json({ message: "Acesso negado!" });

  const secret: string = process.env.SECRET_JWT || "";

  try {
    const verified = jwt.verify(token, secret) as Verifies;

    if (verified.id === process.env.ID_ADMIN) {
       next()
    } else {
        res.status(401).json({ message: "Acesso negado!" });
    }
  } catch (err) {
    res.status(400).json({ message: "O Token é inválido!" });
  }
};

export default checkAdminToken;

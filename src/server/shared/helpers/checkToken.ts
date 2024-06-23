import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { type NextFunction, type Request, type Response } from 'express';

// middleware to validate token
const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Acesso negado!' });
  const secret: string = process.env.SECRET_JWT ?? '';

  try {
    jwt.verify(token, secret);
    // req.user = verified;
    next(); // to continue the flow
  } catch (err) {
    res.status(400).json({ message: 'O Token é inválido!' });
  }
};

export default checkToken;

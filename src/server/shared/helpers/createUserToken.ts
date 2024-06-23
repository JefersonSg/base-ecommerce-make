import { type Request, type Response } from 'express';
import 'dotenv/config';
import { type userInterface } from '../../controllers/user/interfaceUser';

import jwt from 'jsonwebtoken';

const createUserToken = async (
  user: userInterface,
  req: Request,
  res: Response
) => {
  // create a token
  const idAdmin = process.env.ID_ADMIN ?? '';

  const secret = process.env.SECRET_JWT ?? '';

  const token = jwt.sign(
    {
      name: user.name,
      id: user._id
    },
    secret
  );
  const isAdmin = user._id.toString() === idAdmin;

  return res.status(200).json({
    message: 'Você está autenticado',
    token,
    userId: user._id,
    isAdmin
  });
};

export default createUserToken;

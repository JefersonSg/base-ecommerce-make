import { type Request, type Response } from 'express';
import getUserByToken from '../../shared/helpers/getUserByToken';
import getToken from '../../shared/helpers/getToken';
import 'dotenv/config';
import { type userInterface } from './interfaceUser';
import('dotenv/config');
const IMAGE_URL = process.env.IMAGE_URL;

const idAdmin = process.env.ID_ADMIN ?? '';

export const getByToken = async (req: Request, res: Response) => {
  try {
    const token = getToken(req);

    if (token) {
      const userToken = (await getUserByToken(
        res,
        token
      )) as unknown as userInterface;

      if (!userToken) {
        res.status(422).json({ message: 'Usuário não encontrado!' });
      }
      if (!userToken.password) {
        return false;
      }
      userToken.password = '';

      if (userToken.image) {
        userToken.image = `${IMAGE_URL}/users/${userToken.image}`;
      }

      const isAdmin = userToken?._id?.toString() === idAdmin;
      return res.status(200).json({ user: userToken, isAdmin });
    }
  } catch (error) {
    console.log('erro no getByToken user', error);
    res.status(500).json({
      message: 'erro no getByToken user',
      error
    });
  }
};

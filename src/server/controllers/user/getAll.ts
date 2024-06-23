import { type Request, type Response } from 'express';
import User from '../../db/models/User';
const IMAGE_URL = process.env.IMAGE_URL;

export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await User.find();

    if (!users[0]) {
      res.status(422).json({ message: 'nenhum usuario encontrado!' });
      return;
    }

    users.forEach((user) => {
      user.password = '';
      if (user.image) {
        user.image = `${IMAGE_URL}/users/${user.image}`;
      }
    });

    res.status(200).json({ users });
  } catch (error) {
    console.log('erro no getAll users', error);
    return res.status(500).json({
      message: 'erro no getAll users',
      error
    });
  }
};

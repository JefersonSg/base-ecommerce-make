import { type Request, type Response } from 'express';
import User from '../../db/models/User';
import bcrypt from 'bcrypt';
import createUserToken from '../../shared/helpers/createUserToken';
import ShoppingCart from '../../db/models/ShoppingCart';

interface newUser {
  _id?: string;
  name: string;
  surname: string;
  email: string;
  password: string;
}

export const create = async (req: Request, res: Response) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const password = req.body.password;
  const cartId = req.body.cartId;

  // check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(422).json({ message: 'Por favor, utilize outro e-mail!' });
    return;
  }

  // create password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // create user
  const user = new User({
    name,
    surname,
    email,
    password: passwordHash
  });

  try {
    const newUser: newUser | any = await user.save();

    if (cartId && newUser) {
      await ShoppingCart.findByIdAndUpdate(cartId, {
        userId: newUser._id
      });
    }

    await createUserToken(newUser, req, res);
  } catch (error) {
    console.log('erro no create user', error);
    return res.status(500).json({
      message: 'erro no create user',
      error
    });
  }
};

import { Request, Response } from "express";
import User from "../../db/models/User";
import getToken from "../../shared/helpers/getToken";
import getUserByToken from "../../shared/helpers/getUserByToken";
import bcrypt from "bcrypt";
import { uploadToS3 } from "../../shared/helpers/imageUpload";

interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  image: string;
  password: string;
}

export const editUser = async (req: Request, res: Response) => {
  const token = getToken(req);
  const user = await getUserByToken(res, token) as unknown as User;

  const { name, email, password, confirmpassword } = req.body;
  const {id} = req.params

  if (id && id !== user._id.toString()) {
    return res.status(400).json({
      message: 'o Id do token e do parametro fornecido não coincidem'
    })
  }

  if (req.file) {
    const fileName = await uploadToS3('users',req.file)
    user.image = fileName;
  }


  user.name = name;
  const userExists = await User.findOne({ email: email });

  if (user?.email !== email && userExists) {
    res.status(422).json({ message: "E-mail em uso, utilize outro e-mail!" });
    return;
  }

  user.email = email;

  if (password != confirmpassword) {
    res.status(422).json({ error: "As senhas não conferem." });
  } else if (password == confirmpassword && password != null) {
    const salt = await bcrypt.genSalt(12);
    const reqPassword = req.body.password;
    const passwordHash = await bcrypt.hash(reqPassword, salt);

    user.password = passwordHash;
  }

  try {
    let updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: user },
      { new: true },
    );

    if (!updatedUser) return res.status(404).json({message: 'Erro ao atualizar'})

    updatedUser.password = ''


    res.json({
      message: "Usuário atualizado com sucesso!",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

import { Request, Response } from "express";
import User from "../../db/models/User";
import getToken from "../../shared/helpers/getToken";
import getUserByToken from "../../shared/helpers/getUserByToken";
import bcrypt from "bcrypt";
import { removeImageS3, uploadToS3 } from "../../shared/helpers/imageUpload";

interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  image?: string;
  password: string;
}

export const editUser = async (req: Request, res: Response) => {
  const token = getToken(req);
  const user = (await getUserByToken(res, token)) as unknown as User;

  if (!user) {
    return res.status(404).json({
      message: "nenhum usuario encontrado",
    });
  }

  const { name,surname, email, password, confirmpassword } = req.body;
  const image = req.file
  const { id } = req.params;

  if (id && id !== user._id.toString()) {
    return res.status(400).json({
      message: "o Id do token e do parametro fornecido não coincidem",
    });
  }

  const emailUsing = await User.findOne({ email: email });

  if (user?.email !== email && emailUsing) {
    res.status(422).json({ message: "E-mail em uso, utilize outro e-mail!" });
    return;
  }

    user.email = email ?? user.email;
    user.surname = surname ?? user.surname;
    user.name = name ?? user.name;
  
  if (image) {
    const fileName = await uploadToS3("users", image);
    if (user.image) {
      await removeImageS3('users', user?.image)
    }
    user.image = fileName;
  } else {
    user.image = user.image
  }

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

    if (!updatedUser)
      return res.status(404).json({ message: "Erro ao atualizar" });

    updatedUser.password = "";

    res.json({
      message: "Usuário atualizado com sucesso!",
      data: updatedUser,
    });
  } catch (error) {
    console.log("erro no updateUserById", error);
    return res.status(500).json({
      message: "erro no updateUserById",
      error,
    });
  }
};

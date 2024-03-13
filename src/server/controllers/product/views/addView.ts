import { Request, Response } from "express";
import Product from "../../../db/models/Product";
import testeID from "../../../shared/helpers/verifyId";
import getToken from "../../../shared/helpers/getToken";
import getUserByToken from "../../../shared/helpers/getUserByToken";
import { userInterface } from "../../user/interfaceUser";
import ViewsModel from "../../../db/models/Views";

export const addView = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  const { userToken } = req.body;

  const user = (await getUserByToken(
    res,
    userToken,
  )) as unknown as userInterface;

  if (!productId) {
    return res.status(401).json({
      message: "e necessario enviar o productId",
    });
  }

  const testeId = testeID(productId);

  if (!testeId) {
    return res.status(401).json({
      message: "Id do produto e invalido",
    });
  }
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      message:
        "nao e possivel add nova view,  produto nao encontrado com esse id",
    });
  }
  try {
    const newView = await new ViewsModel({
      product: productId,
      userId: user._id ?? null,
    }).save();

    return res.status(200).json({
      message: "view salvo com sucesso",
      newView,
    });
  } catch (error) {
    console.log("erro ao adicionar view");
    return res.status(500).json({ message: error });
  }
};

import { type Request, type Response } from "express";
import { consultarCep } from "correios-brasil";

export const consultCep = async (req: Request, res: Response) => {
  try {
    const { cep } = req.body;

    const cepLimpo = cep.replace("-", "");

    if (cepLimpo.length === 8) {
      const consulta = await consultarCep(cepLimpo);

      return res.status(200).json({
        consulta,
      });
    } else {
      return res.status(400).json({
        erro: "verifique o cep digitado",
      });
    }
  } catch (error) {
    return res.status(400).json({
      erro: "Nenhum cep",
      error,
    });
  }
};

import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import multer from "multer";

export default function handleUploadError(err: ErrorRequestHandler, req : Request, res : Response, next: NextFunction) {
    // Verifique se o erro é do Multer
    if (err instanceof multer.MulterError) {
      // Se for um erro do Multer, envie uma resposta de erro adequada
      res.status(400).send('Erro no upload de arquivo: Campo inesperado');
    } else {
      // Se for outro tipo de erro, passe para o próximo middleware
      next(err);
    }
  }
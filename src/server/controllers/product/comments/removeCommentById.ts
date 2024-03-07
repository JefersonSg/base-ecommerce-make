import { Request, Response } from "express";
import ProductModel from '../../../db/models/Product'
import mongoose from "mongoose";
import { ProductDataBackEnd } from "../../../shared/helpers/Interfaces";
import { removeImageS3 } from "../../../shared/helpers/imageUpload";
import CommentsModel from "../../../db/models/Comments";
import testeID from "../../../shared/helpers/verifyId";


export const removeCommentById = async(req : Request,res : Response)=>{
    const { id } = req.params

    const isValidId = testeID(id)

    if (!isValidId) {
        res.status(422).json({
          message: "ID inválido " + id,
        });
        return;
      }

    const comment = await CommentsModel.findOne({_id: id})

    if (!comment) {
        return res.status(400).json({
            message: 'Nenhum comentário encontrado com esse ID'
        })
    }

    if (comment.image && comment.image.length > 0) {

      await removeImageS3("comments", comment?.image[0]);
    }

      try {
        await CommentsModel.findByIdAndRemove(id)
        return res.status(200).json({
          message: 'commentario removido com sucesso'
        })
      } catch (error) {
        console.log(error)
      }

    }
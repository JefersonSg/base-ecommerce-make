import { Request, Response } from "express";
import ProductModel from '../../../db/models/Product'
import mongoose from "mongoose";
import { CommentInterface, ProductDataBackEnd } from "../../../shared/helpers/Interfaces";
import { removeImageS3, uploadToS3 } from "../../../shared/helpers/imageUpload";
import CommentsModel from "../../../db/models/Comments";

export const updateCommentById = async(req : Request,res : Response)=>{
    const { commentId, comment, stars} = req.body
    const image : any = req.file

    const ObjectId = mongoose.Types.ObjectId;
    if (!ObjectId.isValid(commentId)) {
        res.status(422).json({
          message: "ID inválido, comentário não encontrado",
        });
        return;
      }

  try {
    const commentData = await CommentsModel.findOne({ _id: commentId })

    if (!commentData) {
        return res.status(400).json({
            message: 'Nenhum comentário encontrado com esse ID'
        })
    }

    let updateCommentData : CommentInterface = {
        userId: commentData?.userId ?? '',
        stars: stars ?? commentData?.stars ?? 5,
        productId: commentData.productId,
        image: [],
        comment
      }

      if (image) {
        const newImage = await uploadToS3("comments", image);
  
        updateCommentData.image = [newImage]
        await removeImageS3("comments", commentData?.image[0]);
      } else {
        updateCommentData.image = commentData.image
      }

        const newComment = await CommentsModel.findByIdAndUpdate( commentId, updateCommentData )

        return res.status(200).json({
          message: 'commentario atualizado com sucesso', newComment
        })
      } catch (error) {
        console.log(error)
        return res.status(400).json({
          message: 'Erro na requisição: ' + error
        })
      }

    }
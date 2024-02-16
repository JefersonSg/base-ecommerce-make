import { Request, Response } from "express";
import ProductModel from '../../../db/models/Product'
import mongoose from "mongoose";
import { ProductDataBackEnd } from "../../../shared/helpers/Interfaces";


export const removeCommentById = async(req : Request,res : Response)=>{
    const {id} = req.params
    const {idComment} = req.body

    const ObjectId = mongoose.Types.ObjectId;

    if (!ObjectId.isValid(id)) {
        res.status(422).json({
          message: "ID inválido, produto não encontrado",
        });
        return;
      }

    const product = await ProductModel.findOne({_id: id}) as ProductDataBackEnd

    if (!product) {
        return res.status(400).json({
            message: 'Nenhum produto encontrado com esse ID'
        })
    }
      const commentRemoved = product.comments.filter(comment => comment._id === idComment)

      if (!commentRemoved[0]) {
        return res.status(200).json({
          message: 'Nenhum comentario foi encontrado para ser removido'
        })
      }

      const newComments = product.comments.filter(comment => comment._id !== idComment)

      try {
        const newComment = await ProductModel.findByIdAndUpdate( id, 
          {comments: newComments})
        return res.status(200).json({
          message: 'commentario removido com sucesso', newComments
        })
      } catch (error) {
        console.log(error)
      }

    }
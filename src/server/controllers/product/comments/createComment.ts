import { Request, Response } from "express";
import ProductModel from '../../../db/models/Product'
import mongoose from "mongoose";
import { CommentInterface, ProductDataBackEnd } from "../../../shared/helpers/Interfaces";
import { uploadToS3 } from "../../../shared/helpers/imageUpload";
import { generateID } from "../../../shared/helpers/generateID";

export const createComment = async(req : Request,res : Response)=>{
    const {id} = req.params
    const  comment : CommentInterface  = req.body 
    const images : any = req.files


  if (!comment) {
    return res.status(400).json({
      message: 'insira as informações do comentario'
    })
  }

    const ObjectId = mongoose.Types.ObjectId;

    if (!ObjectId.isValid(id)) {
        res.status(422).json({
          message: "ID inválido, produto não encontrado",
        });
        return;
      }

    const product  = await ProductModel.findOne({_id: id}) as ProductDataBackEnd


    if (!product) {
        return res.status(400).json({
            message: 'Nenhum produto encontrado com esse ID'
        })
    }

    let userAlredyCommented = false
     product.comments.forEach((oldComment)=>{
      if (oldComment.userId === comment.userId) {
         userAlredyCommented = true
      }
    })

    if (userAlredyCommented) {
      return res.status(200).json({
        message: 'Usuário ja possui um comentário neste produto'
      })
    }


    async function uploads() {
      // Use `map` with `Promise.all` to wait for all uploads to complete
      await Promise.all(
        images?.map(async (image: any) => {
          const ImageName = await uploadToS3( 'comments', image);
          image.filename = ImageName;
        }),
      );
    }

    const dataCriação = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`
    const commentData : CommentInterface = {
      _id: generateID(),
      userId: comment.userId,
      comment: comment.comment,
      stars: comment.stars,
      date: dataCriação,
      hours: new Date().getHours(),
      images: [],
      edited: false
    }
    
    if (images && images.length > 0) {
      await uploads()
      images?.map((image: any) => {
        commentData.images.push(image.filename);
      });
    } 

    try {
      const newComment = await ProductModel.findByIdAndUpdate( id, 
        {$push : {comments: commentData}})
      return res.status(200).json({
        message: 'commentario inserido com sucesso', commentData
      })
    } catch (error) {
      console.log(error)
    }

}
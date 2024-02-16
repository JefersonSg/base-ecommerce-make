import { Request, Response } from "express";
import ProductModel from '../../../db/models/Product'
import mongoose from "mongoose";
import { CommentInterface, ProductDataBackEnd } from "../../../shared/helpers/Interfaces";
import { uploadToS3 } from "../../../shared/helpers/imageUpload";

export const updateCommentById = async(req : Request,res : Response)=>{
    const {id} = req.params
    const {idComment, userId, comment, stars} = req.body
    const images : any = req.files

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

    async function uploads() {
      // Use `map` with `Promise.all` to wait for all uploads to complete
      await Promise.all(
        images?.map(async (image: any) => {
          const ImageName = await uploadToS3( 'comments', image);
          image.filename = ImageName;
        }),
      );
    }

      let findComment : CommentInterface[] = product.comments.filter(comment => comment._id === idComment)

      let updateCommentData : CommentInterface = {
        _id: findComment[0]._id ?? '',
        userId: findComment[0].userId ?? '',
        comment: comment ?? findComment[0].comment ?? '' ,
        date: findComment[0].date ?? '',
        hours: findComment[0].hours ?? '',
        stars: stars ?? findComment[0].stars ?? 5 ,
        images:  findComment[0].images,
        edited: true
      }
      
      if (images && images.length > 0) {

        await uploads()
        updateCommentData.images = []
        images?.map((image: any) => updateCommentData.images.push(image.filename));
      } 
    
      const newComments = product.comments.map((commented)=>{
          if (commented._id === idComment) {
            return commented = updateCommentData
          }
          return commented
        })

      try {
        const newComment = await ProductModel.findByIdAndUpdate( id, 
          {comments: newComments})
        return res.status(200).json({
          message: 'commentario inserido com sucesso', newComments
        })
      } catch (error) {
        console.log(error)
      }

    }
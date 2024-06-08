import { type Request, type Response } from "express";
import { removeImageS3, uploadToS3 } from "../../shared/helpers/imageUpload";
import { type ProductDataFrontEnd } from "../../shared/helpers/Interfaces";
import testeID from "../../shared/helpers/verifyId";
import { verifySizeImage } from "../../shared/helpers/verifySize";
import { verifyMimetypeImage } from "../../shared/helpers/verifyMimetype";
import ProductModel from "../../db/models/Product";

export const updateAllProduct = async (req: Request, res: Response) => {
  const id = req.params.id;

  const images: any = req.files;

  // check if ID exists

  try {


    // check if Product exists

    const product = await ProductModel.find();

    if (!product) {
      res.status(404).json({ message: "Produto não encontrado!" });
      return;
    }


    for (let index = 0; index < product.length; index++) {
        const produto = product[index];


        if (produto.stock.amount[0].length) {
            const amount = produto.stock.amount[0]

            const newAmount = amount.map((item: any)=>{
                return [item]
            })

            console.log(newAmount)


            
            const options = { new: true, runValidators: true };
            // const finalAmount = [newAmount]


            await ProductModel.findByIdAndUpdate(
                produto._id ,
                { $set: { "stock.amount": newAmount } },
                options,
              );
        }

    }


    // validations
    // updateData.name = productData.name;
    // updateData.brand = productData.brand;
    // updateData.category = productData.category;
    // updateData.subcategory = productData.subcategory
    //   ? productData.subcategory
    //   : null;
    // updateData.description = productData.description;
    // updateData.price = productData.price;
    // updateData.size = productData.size.split(',') ?? "";
    // updateData.colors = productData?.colors?.split(",") ?? "";
    // updateData.codeColors = productData?.codeColors?.split(",") ?? "";
    // updateData.composition = productData.composition;
    // updateData.characteristic = productData.characteristic;
    // updateData.howToUse = productData.howToUse;
    // updateData.active = productData.active;
    // const stock = {
    //   amount: JSON.parse(productData.amount)
    // };
    // updateData.stock = stock;
    // updateData.promotion = productData.promotion;
    // updateData.promotionalPrice =
    //   productData.promotionalPrice ?? product.promotionalPrice ?? 0;

    // if (images?.length > 0) {
    //   if (verifySizeImage(images)) {
    //     return res.status(401).json({
    //       message: verifySizeImage(images),
    //     });
    //   }

    //   if (verifyMimetypeImage(images)) {
    //     return res.status(401).json({
    //       message: verifyMimetypeImage(images),
    //     });
    //   }

    //   updateData.images = [];

    //   const newImages = await uploads(images, product?.images);

    //   newImages.map((image: any) => {
    //     return updateData.images.push(image);
    //   });
    // }

    // await Product.findByIdAndUpdate(id, updateData);

    return res
      .status(200).json(
        'ok'
      )
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "erro ao fazer update",
      error,
    });
  }
};

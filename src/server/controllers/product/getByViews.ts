import { Request, Response } from "express";
import Product from "../../db/models/Product";
import ViewsModel from "../../db/models/Views";


import ('dotenv/config')

const IMAGE_URL = process.env.IMAGE_URL

export const getByViews = async (req: Request, res: Response) => {

  const { skip } = req.params

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {


    const productViews = await ViewsModel.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: "$product",
          viewCount: { $sum: 1 }
        }
      },
      {
        $sort: { viewCount: -1 }
      }
    ]);
    

    const productsPerViewsIds: any = productViews.map(view => view._id);

    const productsPerViews = await Product.find({
      _id: { $in: productsPerViewsIds }
    });

    for (const product of productsPerViews) {
      for (let i = 0; i < product.images.length; i++) {
        
    product.images[i] = `${IMAGE_URL}/products/${product.images[i]}`;

      }
    }

    return res.status(200).json({
      products: productsPerViews,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "erro no getByViews",
      error,
    });
  }
};

import { type Request, type Response } from 'express';
import Product from '../../db/models/Product';
import ViewsModel from '../../db/models/Views';

interface ViewCountInterface {
  _id: string;
  viewCount: number;
}
import('dotenv/config');

const IMAGE_URL = process.env.IMAGE_URL;

export const getByViews = async (req: Request, res: Response) => {
  const page = req.params.page ?? 1;
  const total = req.params.total ?? 9;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const productViews = (await ViewsModel.aggregate([
      {
        $match: {
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$product',
          viewCount: { $sum: 1 }
        }
      },
      {
        $sort: { viewCount: -1 }
      }
    ])
      .skip((+page - 1) * +total)
      .limit(+total)) as unknown as ViewCountInterface[];

    const productsPerViewsIds = productViews
      .filter((item) => item._id !== null)
      .map((view) => view._id.toString());

    const products = await Product.find({
      _id: { $in: productsPerViewsIds }
    });

    for (const product of products) {
      if (product?.coverPhoto1) {
        product.coverPhoto1 = `${IMAGE_URL}/products/${product.coverPhoto1}`;
      }
      if (product?.coverPhoto2) {
        product.coverPhoto2 = `${IMAGE_URL}/products/${product.coverPhoto2}`;
      }
      for (let i = 0; i < product.images.length; i++) {
        product.images[i] = `${IMAGE_URL}/products/${product.images[i]}`;
      }
    }

    return res.status(200).json({
      products
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: 'erro no getByViews',
      error
    });
  }
};

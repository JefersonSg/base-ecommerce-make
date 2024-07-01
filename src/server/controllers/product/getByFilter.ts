import { type Request, type Response } from 'express';
import Product from '../../db/models/Product';
import { type ProductDataBackEnd } from '../../shared/helpers/Interfaces';
import testeID from '../../shared/helpers/verifyId';

import('dotenv/config');

const IMAGE_URL = process.env.IMAGE_URL;

interface QueryInterface {
  active?: boolean;
  promotion?: boolean;
  price: { $gte: number; $lte: number };
  category?: string;
  subcategory?: string;
  name?: any;
  color?: string;
  size?: string;
  brand?: string;
}

export const getByFilter = async (req: Request, res: Response) => {
  try {
    const active = req.query.active;
    const promotion = req.query.promotion;
    const category = (
      req.query.category?.length ? req.query.category : null
    ) as string;
    const subcategory = (
      req.query.subcategory?.length ? req.query.subcategory : null
    ) as string;
    const name = (req.query.name?.length ? req.query.name : null) as string;
    const color = (req.query.color?.length ? req.query.color : null) as string;
    const size = (req.query.size?.length ? req.query.size : null) as string;
    const minPrice = parseFloat(
      (req.query.minPrice?.length ? req.query.minPrice : 0) as string
    );
    const maxPrice = parseFloat(
      (req.query.maxPrice?.length ? req.query.maxPrice : Infinity) as string
    );
    const brand = (req.query.brand ? req.query.brand : null) as string;
    const orderBy = (
      req.query.orderBy?.length ? req.query.orderBy : 'createdAt'
    ) as string;
    const orderDirection = req.query.orderDirection === 'desc' ? -1 : 1;
    const page = parseInt(req.params.page) ?? 1;
    const total = parseInt(req.params.total) ?? 10;

    // Verifica se orderBy é uma propriedade válida

    const validOrderByFields = ['name', 'price', 'sales', 'createdAt'];
    if (!validOrderByFields.includes(orderBy)) {
      return res.status(400).send('Invalid orderBy field');
    }

    const query: QueryInterface = {
      price: { $gte: +minPrice, $lte: +maxPrice }
    };

    if (active) {
      query.active = active as unknown as boolean;
    }
    if (promotion) {
      query.promotion = promotion as unknown as boolean;
    }

    if (category) {
      if (!testeID(category)) {
        console.log('ID da Categoria não compativel');
        return res.status(400).json({
          error: 'ID da Categoria não compativel'
        });
      }
      query.category = category;
    }
    if (subcategory) {
      if (!testeID(subcategory)) {
        console.log('ID da Categoria não compativel');
        return res.status(400).json({
          error: 'ID da Subcategoria não compativel'
        });
      }
      query.subcategory = subcategory;
    }
    if (name) {
      query.name = new RegExp(name, 'i');
    }
    if (color) {
      query.color = color;
    }

    if (size) {
      query.size = size;
    }

    if (brand) {
      query.brand = brand;
    }

    const products = (await Product.find(query)
      .skip((+page - 1) * +total)
      .limit(+total)
      .sort({ [orderBy]: orderDirection })) as unknown as ProductDataBackEnd[];

    if (!products) {
      return res.status(200).json({
        message: 'nenhum item encontrado'
      });
    }

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
      message: 'erro no Get Product Filter',
      error
    });
  }
};

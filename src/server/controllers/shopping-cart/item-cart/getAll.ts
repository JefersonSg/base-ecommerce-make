import { type Request, type Response } from 'express';
import ShoppingCart from '../../../db/models/ShoppingCart';
import ItemCart from '../../../db/models/ItemCart';
import Product from '../../../db/models/Product';
import { calculateDeliveryFunc } from '../../../shared/helpers/calculateDeliveryFunc';
import { type ItemsCartInterface } from '../../../shared/helpers/Interfaces';
import 'dotenv/config';

export const getAllItemsCart = async (req: Request, res: Response) => {
  const { cep, cartId, userId } = req.body;

  const cepLimpo = cep?.replace?.('-', '');
  const CepOrigin = process.env.CEP_ORIGIN;

  let shoppingCart = userId.length
    ? await ShoppingCart.findOne({ userId })
    : undefined;

  if (!shoppingCart && cartId) {
    shoppingCart = await ShoppingCart.findById(cartId);
  }

  if (!shoppingCart) {
    res.status(200).json({
      message: 'nenhum item no carrinho / Carrinho não criado'
    });
    return;
  }

  const itemsCart = (await ItemCart.find({
    shoppingCartId: shoppingCart._id
  })) as unknown as ItemsCartInterface[];

  if (!itemsCart) {
    res.status(404).json({
      message: 'nenhum item encontrado no carrinho'
    });
    return;
  }

  const values: any[] | null = await Promise.all(
    itemsCart.map(async (item) => {
      const productPrice = await Product.findOne({ _id: item.productId });

      if (productPrice) {
        const colorIndex = productPrice.colors.indexOf(item.color);
        const sizeIndex = productPrice.size.indexOf(item.size);

        if (colorIndex < 0 || sizeIndex < 0) {
          await ItemCart.findByIdAndRemove(item._id);

          return null;
        }
        if (productPrice.promotion && productPrice.promotionalPrice) {
          return +productPrice.promotionalPrice;
        }
        return +productPrice.price;
      }

      return null;
    })
  );

  const actualValue = values.map(
    (value, index) => itemsCart[index].amount * value
  );

  const entrega = await calculateDeliveryFunc(cep, itemsCart, actualValue);

  if (CepOrigin === cepLimpo) {
    const retirada = {
      id: 99,
      name: 'Retirada na loja',
      price: '00.00',
      custom_price: '00.00',
      currency: 'R$',
      delivery_time: 1,
      delivery_range: { max: 'Combinar' },
      custom_delivery_time: 'Combinar',
      custom_delivery_range: { min: 1, max: 'Combinar' },
      company: {
        id: 1,
        name: 'Retirada na loja',
        picture: ''
      }
    };

    const motoboy = {
      id: 100,
      name: 'Motoboy',
      price: '10.00',
      custom_price: '10.00',
      currency: 'R$',
      delivery_time: 1,
      delivery_range: { max: '2 Horas' },
      custom_delivery_time: '2 Horas',
      custom_delivery_range: { max: '2 Horas' },
      company: {
        id: 1,
        name: 'Motoboy',
        picture: ''
      }
    };

    entrega.unshift(motoboy, retirada);
  }
  const totalValue = actualValue.reduce((i: number, value) => i + value, 0);

  try {
    return res.status(200).json({
      itemsCart,
      prices: actualValue,
      totalValue,
      shippingOptions: entrega
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

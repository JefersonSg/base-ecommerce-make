import { type Request, type Response } from 'express';
import ShoppingCart from '../../../db/models/ShoppingCart';
import ItemCart from '../../../db/models/ItemCart';
import Product from '../../../db/models/Product';
import { type ProductDataBackEnd } from '../../../shared/helpers/Interfaces';

export const addNewItemCart = async (req: Request, res: Response) => {
  const { userId, productId, color, amount, size } = req.body;

  try {
    let shoppingCart = await ShoppingCart.findOne({ userId, status: 'aberto' });

    if (!shoppingCart) {
      shoppingCart = await new ShoppingCart({
        userId,
        status: 'aberto'
      }).save();
    }

    const product = (await Product.findById(productId)) as ProductDataBackEnd;

    if (!product) {
      return res.status(404).json({
        message: 'Erro ao procurar pelo produto'
      });
    }
    const colorIndex = product.colors.indexOf(color);
    const sizeIndex = product.size.indexOf(size);

    if (colorIndex < 0 || sizeIndex < 0) {
      return res.status(400).json({
        message:
          'Erro ao atualizar o produto, está cor / tamanho não está disponível'
      });
    }

    if (Number(amount) < 1) {
      res.status(404).json({
        message: 'o item não pode ser menor do que zero'
      });
      return;
    }

    if (Number(amount) > product.stock.amount[colorIndex][sizeIndex]) {
      try {
        res.status(400).json({
          error: 'Limite alcançado /  sem estoque'
        });
        return;
      } catch (error) {
        console.log('Erro ao atualizar o item-cart', error);
        res.status(400).json({
          message: 'Limite alcançado'
        });
      }
    }

    const checkItemCart = await ItemCart.findOne({
      shoppingCartId: shoppingCart._id,
      productId,
      color,
      size
    });

    if (checkItemCart) {
      checkItemCart.amount =
        product.stock.amount[colorIndex][sizeIndex] > checkItemCart.amount + 1
          ? checkItemCart.amount + 1
          : product.stock.amount[colorIndex][sizeIndex];

      const newItemCart = await ItemCart.findByIdAndUpdate(
        checkItemCart?._id,
        checkItemCart
      );
      return res.status(200).json({
        message: 'Adicionou +1 ao amount',
        newItemCart
      });
    }

    const itemCart = await new ItemCart({
      shoppingCartId: shoppingCart._id,
      productId,
      color: color.length > 0 ? color : '',
      amount,
      size
    }).save();

    return res
      .status(200)
      .json({ message: 'Item adicionado ao carrinho com sucesso', itemCart });
  } catch (error) {
    console.error('Erro ao adicionar item ao carrinho:', error);
    return res
      .status(500)
      .json({ error: 'Ocorreu um erro ao processar a solicitação' });
  }
};

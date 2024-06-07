import { type Request, type Response } from "express";

import ShoppingCart from "../../db/models/ShoppingCart";
import ItemCart from "../../db/models/ItemCart";
import Product from "../../db/models/Product";
import {
  type ItemsCartInterface,
  type AddressInterface,
  type ProductDataBackEnd,
  type cuponsInterface,
  type delivery,
} from "../../shared/helpers/Interfaces";
import Orders from "../../db/models/Orders";
import AddressModel from "../../db/models/Address";
import { calculateDeliveryFunc } from "../../shared/helpers/calculateDeliveryFunc";
import { Payment } from "../payment/methods/payment";
import { v4 as uuidv4 } from "uuid";
import { CuponsModel } from "../../db/models/Cupons";
import CuponsUsed from "../../db/models/CuponsUsed";

export const createOrder = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const { cupom, methodPayment, serviceShippingId } = req.body;
  const hoje = new Date();

  let itemNoStock: any = [];

  if (!userId) {
    return res.status(400).json({
      message: "É necessário o id do usuário",
    });
  }

  if (!methodPayment) {
    return res.status(400).json({
      message: "É necessário preencher o Método de pagamento",
    });
  }
  if (!serviceShippingId) {
    return res.status(400).json({
      message: "É necessário preencher o Método de envio",
    });
  }

  try {
    const address = (await AddressModel.findOne({
      userId,
    })) as AddressInterface;

    const shoppingCart = await ShoppingCart.findOne({
      userId,
      status: "aberto",
    });

    if (!shoppingCart) {
      res.status(200).json({
        message: "nenhum item no carrinho / Carrinho não criado",
      });
      return;
    }

    const itemsCart = (await ItemCart.find({
      shoppingCartId: shoppingCart._id,
    })) as unknown as ItemsCartInterface[];

    if (!itemsCart[0]) {
      res.status(404).json({
        message: "nenhum item encontrado no carrinho",
      });
      return;
    }

    const getCupom = (await CuponsModel.findOne({
      code: cupom,
    })) as cuponsInterface;

    if (getCupom) {
      const checkIfAlreadyUse = await CuponsUsed.findOne({
        userId,
        code: getCupom.code,
        idCupom: getCupom._id?.toString(),
      });

      if (checkIfAlreadyUse) {
        return res.status(404).json({
          erro: "Você está usando um cupom que já foi usado antes",
        });
      }
      if (getCupom?.expiration && getCupom.expiration < hoje) {
        return res.status(400).json({
          erro: "Cupom expirado",
        });
      }
    }

    const produtosId: string[] = [];
    const produtosNames: string[] = [];
    const produtosCores: string[] = [];
    const produtosQuantidade: number[] = [];
    const produtosValores: number[] = [];

    const valorDescontoPorcentagem = getCupom?.percentageDiscount
      ? getCupom?.percentageDiscount / 100
      : undefined;

    const values: any[] | null = await Promise.all(
      itemsCart.map(async (item) => {
        const productPrice = (await Product.findOne({
          _id: item.productId,
        })) as ProductDataBackEnd & {
          _id: string;
        };

        if (+productPrice?.stock?.amount <= 0) {
          itemNoStock = productPrice;
        }

        if (productPrice) {
          const colorIndex = productPrice.colors.indexOf(item?.color ?? "");
          const sizeIndex = productPrice.size.indexOf(item.size);

          if (colorIndex < 0 || sizeIndex < 0) {
            await ItemCart.findByIdAndRemove(item._id);
            itemNoStock = productPrice;
            return null;
          }
          if (productPrice.promotion && productPrice.promotionalPrice) {
            produtosId.push(productPrice._id);
            produtosCores.push(item?.color ?? "");
            produtosQuantidade.push(+item.amount);
            produtosNames.push(productPrice.name);
            produtosValores.push(+productPrice.promotionalPrice);

            return +productPrice.promotionalPrice;
          }
          produtosId.push(productPrice._id);
          produtosCores.push(item?.color ?? "");
          produtosQuantidade.push(+item.amount);
          produtosValores.push(+productPrice.price);
          produtosNames.push(productPrice.name);

          return +productPrice.price;
        }

        return null;
      }),
    );

    if (itemNoStock?.[0]) {
      return res.status(401).json({
        message:
          "O pedido não pode ser finalzado pois o ha um item sem estoque",
        itemNoStock,
      });
    }

    const actualValue = values.map(
      (value, index) => itemsCart[index].amount * value,
    );

    let shippingOrder: any = [];

    if (serviceShippingId === 99) {
      shippingOrder = {
        id: 99,
        name: "retirada",
        company: { name: "retirada" },
        price: 0,
      };
    }

    if (serviceShippingId === 100) {
      shippingOrder = {
        id: 99,
        name: "motoboy",
        company: { name: "motoboy" },
        price: 10,
      };
    }

    if (!shippingOrder.price && serviceShippingId !== 99) {
      shippingOrder = (await calculateDeliveryFunc(
        address.cep,
        itemsCart,
        actualValue,
        serviceShippingId,
      )) as delivery;
    }

    if (!shippingOrder?.price && serviceShippingId !== 99) {
      return res.status(400).json({
        error: "Erro ao buscar o valor do frete selecionado",
      });
    }

    const totalValue = actualValue.reduce((i: number, value) => i + value, 0);

    const allItemsToPayment = itemsCart.map((item, index) => {
      const price = valorDescontoPorcentagem
        ? +(
            produtosValores[index] -
            produtosValores[index] * valorDescontoPorcentagem
          ).toFixed(2)
        : produtosValores[index];

      return {
        id: item.productId.toString(),
        title: produtosNames[index],
        quantity: item.amount,
        unit_price: price,
      };
    });

    const fretePayment = {
      id: `${shippingOrder.id}`,
      title: shippingOrder.company.name,
      quantity: 1,
      unit_price: Number(shippingOrder.price),
    };

    const paymentId = uuidv4();

    const payment =
      serviceShippingId === 99
        ? await Payment(allItemsToPayment, paymentId)
        : await Payment(allItemsToPayment, paymentId, fretePayment);

    if (!payment) {
      return res.status(500).json({
        error: "Erro ao gerar o pagamento do pedido",
      });
    }

    const newOrder = new Orders({
      paymentId,
      paymentLink: payment.paymentLink,
      address,
      userId,
      methodPayment,
      status: "pendente",
      productIds: produtosId,
      productAmounts: produtosQuantidade,
      productColors: produtosCores,
      valueProducts: produtosValores,
      orderTracking: "",
      totalPayment: Number((totalValue + +shippingOrder.price).toFixed(2)),
      discount: valorDescontoPorcentagem
        ? +(totalValue * valorDescontoPorcentagem).toFixed(2)
        : 0,
      shippingValue: shippingOrder.price,
      shippingMethod: shippingOrder?.name,
      shippingCompany: shippingOrder?.company?.name,
    });

    const createOrder = await newOrder.save();

    if (cupom && getCupom.code) {
      await new CuponsUsed({
        code: getCupom.code,
        idCupom: getCupom._id,
        userId,
      }).save();

      await CuponsModel.findOneAndUpdate(
        { code: cupom },
        {
          $set: { uses: getCupom.uses + 1 },
        },
      );
    }

    for (let i = 0; i < itemsCart.length; i++) {
      const item = itemsCart[i];

      const productPrice = (await Product.findOne({
        _id: item.productId,
      })) as ProductDataBackEnd & {
        _id: string;
      };

      const indexColor = productPrice.colors.indexOf(item?.color ?? '');
      const indexSize = productPrice.size.indexOf(item.size ?? '')

      const newAmount = [...productPrice?.stock?.amount];


      if (newAmount[indexColor][indexSize] < +item.amount) {
        return res.status(404).json({
          message: "Estoque insuficiente",
        });
      }

      newAmount[indexColor][indexSize] = newAmount[indexColor][indexSize] - item.amount;

      const options = { new: true, runValidators: true };
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $set: {
            "stock.amount": newAmount,
            sales: productPrice.sales + item.amount,
          },
        },
        options,
      );
    }

    // Removendo os itens do carrinho
    for (let i = 0; i < itemsCart.length; i++) {
      const item = itemsCart[i];

      try {
        await ItemCart.findByIdAndDelete(item._id);
      } catch (error) {
        console.log("erro ao deletar item do carrinho", error);
      }
    }

    return res.status(200).json({
      message: "Pedido criado com sucesso",
      createOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Erro ao criar o pedido",
      error,
    });
  }
};

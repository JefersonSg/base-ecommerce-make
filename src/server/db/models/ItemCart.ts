import mongoose from "../conn";

const { Schema } = mongoose;

const ItemCart = mongoose.model(
  "item_cart",
  new Schema({
    shoppingCartId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  }),
);

export default ItemCart;

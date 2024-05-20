import mongoose from "../conn";

const { Schema } = mongoose;

const ItemCart = mongoose.model(
  "item_cart",
  new Schema({
    shoppingCartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shopping-carts",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    color: {
      type: String,
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

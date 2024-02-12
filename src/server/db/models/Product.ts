import mongoose from "../conn";

const { Schema } = mongoose;

const Product = mongoose.model(
  "product",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      brand: {
        type: String,
      },
      description: {
        type: String,
      },
      category: {
        type: String,
        required: true,
      },
      subcategory: {
        type: String,
        required: true,
      },
      size: {
        type: String,
      },
      composition: {
        type: String,
      },
      characteristic: {
        type: String,
      },
      price: {
        type: Number,
        required: true,
      },
      colors: {
        type: Array,
        required: true,
      },
      codeColors: {
        type: Array,
        required: true,
      },
      images: {
        type: Array,
        required: true,
      },
      stock: {
        type: Object,
      },
      promotion: {
        type: Boolean,
      },
      promotionalPrice: {
        type: Number,
      },
      active: {
        type: Boolean,
      },
    },
    { timestamps: true },
  ),
);

export default Product;

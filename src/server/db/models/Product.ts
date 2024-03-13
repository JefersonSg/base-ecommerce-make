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
        required: true,
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
        required: true,
        default: false,
      },
      promotionalPrice: {
        type: Number,
        required: true,
        default: 0,
      },

      active: {
        type: Boolean,
        required: true,
        default: true,
      },
      sales: {
        type: Number,
        required: true,
        default: 0,
      },
      assessment: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    { timestamps: true },
  ),
);

export default Product;

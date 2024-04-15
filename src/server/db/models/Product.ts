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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required: true,
      },
      subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subcategories',
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
      howToUse: {
        type: String,
      },
      price: {
        type: Number,
        required: true,
      },
      colors: {
        type: Array,
      },
      codeColors: {
        type: Array,
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

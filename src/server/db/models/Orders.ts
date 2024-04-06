import mongoose from "../conn";

const { Schema } = mongoose;

const Orders = mongoose.model(
  "orders",
  new Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'addresses',
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      productIds: {
        type: Array<String>,
        required: true,
      },
      productPayment: {
        type: Array<Number>,
        required: true,
      },
      productAmounts: {
        type: String,
        required: true,
      },
      productColors: {
        type: String,
        required: true,
      },
      totalPayment: {
        type: String,
        required: true,
      },
      methodPayment: {
        type: String,
        required: true,
      },
      discount: {
        type: String,
      },
      orderTracking: {
        type: String,
        required: true,
      },
    },
    { timestamps: true },
  ),
);

export default Orders;

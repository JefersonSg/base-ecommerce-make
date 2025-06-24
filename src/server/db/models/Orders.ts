import { type AddressInterface } from '../../shared/helpers/Interfaces';
import mongoose from '../conn';

const { Schema } = mongoose;

const Orders = mongoose.model(
  'orders',
  new Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
      },
      paymentId: {
        type: String,
        required: true
      },
      paymentLink: {
        type: String,
        required: true
      },
      address: {
        type: Array<AddressInterface>,
        required: true
      },
      status: {
        type: String,
        required: true
      },
      productIds: {
        type: Array<string>,
        required: true
      },
      valueProducts: {
        type: Array<number>,
        required: true
      },
      productAmounts: {
        type: Array<string>,
        required: true
      },
      productSizes: {
        type: Array<string>,
        required: true
      },
      productColors: {
        type: Array<string>,
        required: true
      },
      totalPayment: {
        type: String,
        required: true
      },
      methodPayment: {
        type: String,
        required: true
      },
      discount: {
        type: Number
      },
      orderTracking: {
        type: String
      },
      shippingMethod: {
        type: String,
        required: true
      },
      shippingValue: {
        type: Number,
        required: true
      },
      shippingCompany: {
        type: String,
        required: true
      }
    },
    { timestamps: true }
  )
);

export default Orders;

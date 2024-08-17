import mongoose from '../conn';

const { Schema } = mongoose;

const ShoppingCart = mongoose.model(
  'shopping-cart',
  new Schema(
    {
      userId: {
        type: String,
        ref: 'users'
      },
      status: {
        type: String,
        required: true
      }
    },
    { timestamps: true }
  )
);

export default ShoppingCart;

import mongoose from "../conn";

const { Schema } = mongoose;

const Car = mongoose.model(
  "metrics",
  new Schema({
    userID: {
      type: String,
    },
    productID: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    deteled: {
      type: Boolean,
    },
  }),
);

export default Car;

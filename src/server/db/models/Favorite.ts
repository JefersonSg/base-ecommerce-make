import mongoose from "../conn";

const { Schema } = mongoose;

const FavoriteModel = mongoose.model(
  "favorite",
  new Schema({
    userId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
  ),
);

export default FavoriteModel;

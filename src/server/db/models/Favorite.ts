import mongoose from "../conn";

const { Schema } = mongoose;

const FavoriteModel = mongoose.model(
  "favorite",
  new Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
      },
    },
    { timestamps: true },
  ),
);

export default FavoriteModel;

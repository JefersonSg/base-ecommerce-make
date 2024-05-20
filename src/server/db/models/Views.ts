import mongoose from "../conn";

const { Schema } = mongoose;

const ViewsModel = mongoose.model(
  "views",
  new Schema(
    {
      ip: {
        type: String,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
    { timestamps: true },
  ),
);

export default ViewsModel;

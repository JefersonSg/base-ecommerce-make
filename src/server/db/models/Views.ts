import mongoose from "../conn";

const { Schema } = mongoose;

const ViewsModel = mongoose.model(
  "views",
  new Schema(
    {
      product: {
        type: String,
        ref: "Produto",
        required: true,
      },
      userId: {
        type: String,
        ref: "User",
      },
    },
    { timestamps: true },
  ),
);

export default ViewsModel;

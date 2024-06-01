import mongoose from "../conn";

const { Schema } = mongoose;

const ViewsModel = mongoose.model(
  "views",
  new Schema({
    ip: {
      type: String,
    },
    sessionId: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    pageView: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
  }),
);

export default ViewsModel;

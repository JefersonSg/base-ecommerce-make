import mongoose from "../conn";

const { Schema } = mongoose;

const Metrics = mongoose.model(
  "metrics",
  new Schema({
    userID: {
      type: String,
    },
    date: {
      type: String,
      required: true,
    },
    pageVisit: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
    },
  }),
);

export default Metrics;

import mongoose from "../conn";

const { Schema } = mongoose;

const Category = mongoose.model(
  "category",
  new Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  }),
);

export default Category;

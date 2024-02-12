import mongoose from "../conn";

const { Schema } = mongoose;

const SubcategoryModel = mongoose.model(
  "subcategory",
  new Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  }),
);

export default SubcategoryModel;

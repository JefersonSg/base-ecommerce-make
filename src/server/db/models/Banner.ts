import mongoose from "../conn";

const { Schema } = mongoose;

const BannersModel = mongoose.model(
  "banners",
  new Schema({
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    images: {
      type: Array,
      required: true
    },
  }),
);

export default BannersModel;

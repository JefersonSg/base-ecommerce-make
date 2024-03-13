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
    imageMobile: {
      type: String,
      required: true,
    },
    imageDesktop: {
      type: String,
      required: true,
    },
  }),
);

export default BannersModel;

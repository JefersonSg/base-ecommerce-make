import mongoose from "../conn";

const { Schema } = mongoose;

export interface CommentInterface {
  _id: string;
  userId: string;
  comment: string;
  date: string;
  hours: number;
  images: string[];
  stars: number;
  edited: boolean;
}

const CommentsModel = mongoose.model(
  "comments",
  new Schema({
    productId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    image: {
      type: Array,
    },
    stars: {
      type: Number,
    },

  }, {timestamps: true}),
);

export default CommentsModel;

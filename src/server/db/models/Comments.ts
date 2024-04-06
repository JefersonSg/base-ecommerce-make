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
  new Schema(
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
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
    },
    { timestamps: true },
  ),
);

export default CommentsModel;

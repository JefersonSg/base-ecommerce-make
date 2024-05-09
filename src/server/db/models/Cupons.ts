import { boolean } from "yup";
import mongoose from "../conn";

const { Schema } = mongoose;


export const CuponsModel = mongoose.model(
    "cupons",
    new Schema(
      {
        code: {
          type: String,
          ref: 'products',
          required: true,
        },
        userId: [{
          type: Schema.Types.ObjectId,
          ref: 'users'
        }],
        expiration: {
            type: Date,
        },
        limitUses: {
          type: Number,
        },
        uses: {
          type: Number,
          default: 0
        },
        percentageDiscount: {
          type: Number,
        },
        minimumValue: {
            type: Number,
        },
        active: {
          type: Boolean,
          required: true
        }
      }
    ),
  );
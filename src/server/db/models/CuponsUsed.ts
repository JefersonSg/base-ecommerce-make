import mongoose from "../conn";

const { Schema } = mongoose;

const CuponsUsed = mongoose.model(
  "cuponsUsed",
  new Schema(
    {
      idCupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cupons",
        required: true,
      },
      code: {
        type: String,
        ref: "Cupons",
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    },
    { timestamps: true },
  ),
);

export default CuponsUsed;

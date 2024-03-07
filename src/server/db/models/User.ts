import mongoose from "../conn";

const { Schema } = mongoose;

const collectionName = process.env.MONGO_COLLECTION


const User = mongoose.model(
  "user",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      surname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },

      password: {
        type: String,
        required: true,
      },

      image: {
        type: String,
      },
    },
    { timestamps: true },
  ),
);

export default User;

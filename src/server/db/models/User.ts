import mongoose from "../conn";

const { Schema } = mongoose;

const User = mongoose.model(
  "User",
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

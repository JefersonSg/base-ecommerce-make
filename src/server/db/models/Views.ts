import mongoose from "../conn";

const { Schema } = mongoose;

  const ViewsModel = mongoose.model(
    "views",
    new Schema(
      {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Produto'
          },
          date: {
            type: Date,
            default: Date.now
          }
      }
    ),
  );


export default ViewsModel
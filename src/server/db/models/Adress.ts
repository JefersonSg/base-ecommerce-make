import mongoose from "../conn";

const { Schema } = mongoose;

const AdressModel = mongoose.model(
  "adress",
  new Schema({
    userId: {
      type: String,
      required: true,
    },
    cidade: {
      type: String,
      required: true,
    },
    rua: {
      type: String,
      required: true,
    },
    bairro: {
      type: String,
      required: true,
    },
    cep: {
      type: String,
      required: true,
    },
    referencia: {
      type: String,
      required: true,
    },
    complemento: {
      type: String,
      required: true,
    },
    numero: {
      type: String,
      required: true,
    },
  }),
);

export default AdressModel;

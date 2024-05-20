import mongoose from "../conn";

const { Schema } = mongoose;

const AddressModel = mongoose.model(
  "address",
  new Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    nome: {
      type: String,
      required: true,
    },
    cpf: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    cep: {
      type: String,
      required: true,
    },
    cidade: {
      type: String,
      required: true,
    },
    uf: {
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
    telefone: {
      type: String,
      required: true,
    },
  }),
);

export default AddressModel;

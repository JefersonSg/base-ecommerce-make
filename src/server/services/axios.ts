import axios from "axios";

export const instanciaAxiosPG = axios.create({
  baseURL: "https://api.pagar.me/core/v5.",
  params: {
    api_key: process.env.API_KEY_PAGARME,
  },
});

import { validate } from "../../../shared/middleware/Validation";
import * as yup from "yup";

export const validationCreateAdress = validate({
  body: yup.object().shape({

    cidade: yup
      .string()
      .min(3, 'O nome deve ter no minimo 3 caracteres')
      .required('É necessário preencher a cidade').max(30),
    rua: yup
      .string()
      .min(3, 'O nome deve ter no minimo 3 caracteres')
      .required('É necessário preencher a rua').max(50),
    bairro: yup
      .string()
      .required('É necessário preencher o campo de bairro'),
    cep: yup
      .string()
      .required('é necerrário preencher o cep')
      .min(8, 'A referencia deve ter no mínimo 8 caracteres').max(9),
    referencia: yup
      .string()
      .required('É necessário preencher o campo de senha')
      .min(5, 'A referencia deve ter no mínimo 5 caracteres').max(50),
    numero: yup
      .number()
      .required('É necessário preencher o campo de numero')
      .min(0, 'o numero deve ter no mínimo 1 caracteres').max(99999),
    complemento: yup
      .string()
      .required('É necessário preencher o campo de complemento')
      .min(4, 'complemento deve ter no mínimo 4 caracteres').max(60)
  }),
});

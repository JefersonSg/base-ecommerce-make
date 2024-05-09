import { validate } from "../../shared/middleware/Validation";

import * as yup from "yup";

export const validationCupons = validate({
  body: yup.object().shape({
    code: yup.string().required(),
    userId: yup.array().of(yup.string().required('Cada item da array deve ser uma string')),
    expiration: yup.date(),
    limitUses: yup.number().nullable(),
    percentageDiscount: yup.number().nullable(),
    valueFixDiscount: yup.number().nullable(),
    minimumValue: yup.number().nullable(),
    active: yup.boolean().required()
  }),
});

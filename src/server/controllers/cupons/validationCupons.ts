import { validate } from "../../shared/middleware/Validation";

import * as yup from "yup";

export const validationCupons = validate({
  body: yup.object().shape({
    code: yup.string().required(),
    userId: yup
      .array()
      .of(yup.string().required("Cada item da array deve ser uma string")),
    limitUses: yup.mixed().nullable().default(NaN),
    percentageDiscount: yup.mixed().nullable().default(NaN).required(),
    minimumValue: yup.mixed().nullable().default(NaN),
    expiration: yup
      .date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      ),
    active: yup.boolean().required(),
  }),
});

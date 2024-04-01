import { validate } from "../../shared/middleware/Validation";
import * as yup from "yup";

export const validationBanner = validate({
  body: yup.object().shape({
    name: yup.string().required().min(3),
    link: yup.string().required().min(1),
    active: yup.boolean().required(),
  }),
});

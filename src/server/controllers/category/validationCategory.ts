import { validate } from "../../shared/middleware/Validation";
import * as yup from "yup";

export const validationCategory = validate({
  body: yup.object().shape({
    name: yup.string().required().min(3),
    description: yup.string().required().min(3),
  }),
});

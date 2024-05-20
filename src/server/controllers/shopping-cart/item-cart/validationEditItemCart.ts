import { validate } from "../../../shared/middleware/Validation";
import * as yup from "yup";

export const validationEditItemCart = validate({
  params: yup.object().shape({
    itemId: yup.string().required().min(3),
  }),
  body: yup.object().shape({
    size: yup.string().required().min(1),
    amount: yup.string().required().min(1),
    color: yup.string(),
  }),
});

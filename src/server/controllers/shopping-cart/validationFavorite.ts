import { validate } from "../../shared/middleware/Validation";
import * as yup from "yup";

export const validationFavorite = validate({
  body: yup.object().shape({
    userId: yup.string().required().min(3),
    productId: yup.string().required().min(3),
  }),
});

import { validate } from '../../../shared/middleware/Validation';
import * as yup from 'yup';

export const validationCreateItemCart = validate({
  body: yup.object().shape({
    productId: yup.string().required().min(3),
    userId: yup.string().required().min(3),
    size: yup.string().required().min(1),
    amount: yup.number().required().min(1),
    color: yup.string()
  })
});

import { validate } from '../../../shared/middleware/Validation';
import * as yup from 'yup';

export const validationCreateItemCart = validate({
  body: yup.object().shape({
    card_id: yup.string(),
    productId: yup.string().required(),
    userId: yup.string(),
    size: yup.string().required().min(1),
    amount: yup.number().required().min(1),
    color: yup.string()
  })
});

import { validate } from '../../shared/middleware/Validation';
import * as yup from 'yup';

export const validationLoginUser = validate({
  body: yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(6)
  })
});

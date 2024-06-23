import { validate } from '../../shared/middleware/Validation';
import * as yup from 'yup';

export const validationUser = validate({
  body: yup.object().shape({
    name: yup.string().required().min(3),
    surname: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required().min(6),
    confirmpassword: yup
      .string()
      .oneOf([yup.ref('password')], 'As senhas digitadas devem ser iguals')
      .required()
      .min(6)
  })
});

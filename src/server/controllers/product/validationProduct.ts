import { validate } from '../../shared/middleware/Validation';
import * as yup from 'yup';

export const validationProduct = validate({
  body: yup.object().shape({
    name: yup.string().required(),
    brand: yup.string().required(),
    size: yup.string().required(),
    price: yup.number().required(),
    promotion: yup.boolean().required(),
    promotionalPrice: yup.number(),
    category: yup.string().required(),
    subcategory: yup.string(),
    description: yup.string().required(),
    composition: yup.string(),
    characteristic: yup.string(),
    colors: yup.string(),
    codeColors: yup.string(),
    amount: yup.string().required(),
    active: yup.boolean().required()
  })
});

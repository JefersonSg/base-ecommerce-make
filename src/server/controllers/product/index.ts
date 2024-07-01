import * as create from './create';
import * as update from './update';
import * as getById from './getById';
import * as getAll from './getAll';
import * as removeProductById from './delete';
import * as validationProduct from './validationProduct';
import * as getComments from './comments/getComments';
import * as createComment from './comments/createComment';
import * as updateComment from './comments/updateCommentById';
import * as removeCommentById from './comments/removeCommentById';
import * as getByFilter from './getByFilter';
import * as getByViews from './getByViews';
import * as updateAllProduct from './updateAllProducts';

export const ProductController = {
  ...create,
  ...update,
  ...getById,
  ...getAll,
  ...removeProductById,
  ...validationProduct,
  ...getComments,
  ...createComment,
  ...updateComment,
  ...removeCommentById,
  ...getByFilter,
  ...getByViews,
  ...updateAllProduct
};

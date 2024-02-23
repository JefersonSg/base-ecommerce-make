import * as create from "./create";
import * as update from "./update";
import * as getById from "./getById";
import * as getByCategory from "./getByCategory";
import * as getBySubcategory from "./getBySubcategory";
import * as getAll from "./getAll";
import * as removeProductById from "./delete";
import * as validarionProduct from "./validationProduct";
import * as getComments from "./comments/getComments";
import * as createComment from "./comments/createComment";
import * as updateComment from "./comments/updateCommentById";
import * as removeCommentById from "./comments/removeCommentById";
import * as getAllActives from './getAllActives'

export const ProductController = {
  ...create,
  ...update,
  ...getById,
  ...getAll,
  ...getByCategory,
  ...getBySubcategory,
  ...removeProductById,
  ...validarionProduct,
  ...getComments,
  ...createComment,
  ...updateComment,
  ...removeCommentById,
  ...getAllActives
};

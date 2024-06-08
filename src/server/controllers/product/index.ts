import * as create from "./create";
import * as update from "./update";
import * as getById from "./getById";
import * as getByCategory from "./getByCategory";
import * as getBySubcategory from "./getBySubcategory";
import * as getAll from "./getAll";
import * as removeProductById from "./delete";
import * as validationProduct from "./validationProduct";
import * as getComments from "./comments/getComments";
import * as createComment from "./comments/createComment";
import * as updateComment from "./comments/updateCommentById";
import * as removeCommentById from "./comments/removeCommentById";
import * as getAllActives from "./getAllActives";
import * as getByName from "./getByName";
import * as getBySales from "./getBySales";
import * as getByPromotion from "./getByPromotion";
import * as getByViews from "./getByViews";
import * as getAllNoActives from './getNoActives'
import * as  updateAllProduct  from "./updateAllProducts";

export const ProductController = {
  ...create,
  ...update,
  ...getById,
  ...getAll,
  ...getByCategory,
  ...getBySubcategory,
  ...getBySales,
  ...removeProductById,
  ...validationProduct,
  ...getComments,
  ...createComment,
  ...updateComment,
  ...removeCommentById,
  ...getAllActives,
  ...getAllNoActives,
  ...getByName,
  ...getByPromotion,
  ...getByViews,
  ...updateAllProduct
};

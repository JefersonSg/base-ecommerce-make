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
import * as addView from "./views/addView";
import * as getViewsByProductId from "./views/getViewsByProductId";
import * as getAllProductsViews from "./views/getAllProductsViews";
import * as getBySales from "./getBySales";
import * as getByPromotion from './getByPromotion';

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
  ...getByName,
  ...addView,
  ...getViewsByProductId,
  ...getAllProductsViews,
  ...getByPromotion
};

import * as create from "./create";
import * as update from "./update";
import * as getById from "./getById";
import * as getByCategory from "./getByCategory";
import * as getAll from "./getAll";
import * as deleteCategory from "./delete";
import * as validarionProduct from "./validationProduct";

export const ProductController = {
  ...create,
  ...update,
  ...getById,
  ...getAll,
  ...getByCategory,
  ...deleteCategory,
  ...validarionProduct,
};

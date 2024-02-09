import * as create from "./create";
import * as update from "./update";
import * as getById from "./getById";
import * as getAll from "./getAll";
import * as deleteCategory from "./delete";

export const CategoryController = {
  ...create,
  ...update,
  ...getById,
  ...getAll,
  ...deleteCategory,
};

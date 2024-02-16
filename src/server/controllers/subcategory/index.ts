import * as create from "./create";
import * as update from "./update";
import * as getById from "./getById";
import * as getAll from "./getAll";
import * as deleteSubcategory from "./delete";
import * as validationSubcategory from "./validationSubcategory";

export const SubcategoryController = {
  ...create,
  ...update,
  ...getById,
  ...getAll,
  ...deleteSubcategory,
  ...validationSubcategory,
};

import * as getViewsByProductId from "./getViewsByProductId";
import * as getAllProductsViews from "./getAllProductsViews";
import * as getAllViews from "./getAllViews";
import * as addView from "./addView";

export const ViewsController = {
  ...addView,
  ...getViewsByProductId,
  ...getAllProductsViews,
  ...getAllViews,
};

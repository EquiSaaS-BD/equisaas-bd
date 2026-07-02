import { ENGINEERING_BACKEND_HINTS } from "./topic-hints/engineering-backend.js";
import { ENGINEERING_DEVOPS_HINTS } from "./topic-hints/engineering-devops.js";
import { DESIGN_UX_HINTS } from "./topic-hints/design-ux.js";
import { DESIGN_BRAND_HINTS } from "./topic-hints/design-brand.js";
import { PRODUCT_BA_HINTS } from "./topic-hints/product-ba.js";
import { PRODUCT_PM_HINTS } from "./topic-hints/product-pm.js";
import { MARKETING_GROWTH_HINTS } from "./topic-hints/marketing-growth.js";
import { MARKETING_SUCCESS_HINTS } from "./topic-hints/marketing-success.js";

export const LESSON_TOPIC_HINTS = {
  ...ENGINEERING_BACKEND_HINTS,
  ...ENGINEERING_DEVOPS_HINTS,
  ...DESIGN_UX_HINTS,
  ...DESIGN_BRAND_HINTS,
  ...PRODUCT_BA_HINTS,
  ...PRODUCT_PM_HINTS,
  ...MARKETING_GROWTH_HINTS,
  ...MARKETING_SUCCESS_HINTS,
};

import { CONTENT as RAW_CONTENT } from "./content.js";
import { normalizeLocalizedTree } from "@/lib/localized-copy";

export const CONTENT = normalizeLocalizedTree(RAW_CONTENT);
export { departments } from "./departments";
export { phase2Tabs } from "./phase2-tabs";
export { APPLICATION_LINK, LINKS } from "./links";
export {
  FOUNDER_PORTFOLIO_MANIFEST,
  FOUNDER_PROFILE_HUB,
  FOUNDER_SOCIAL_SAME_AS,
  FOUNDER_SELECTED_PROJECTS,
  FOUNDER_SELECTED_LABS,
} from "@/data/founder-portfolio-manifest";

const moduleCache = new Map();

const INTERACTIVE_PATH_LOADERS = {
  "se-frontend": () => import("./courses/engineering-frontend.js").then((mod) => mod.FRONTEND_COURSES),
  "se-backend": () => import("./courses/engineering-backend.js").then((mod) => mod.BACKEND_COURSES),
  "se-devops": () => import("./courses/engineering-devops.js").then((mod) => mod.DEVOPS_COURSES),
  "design-ux": () => import("./courses/design.js").then((mod) => mod.DESIGN_COURSES),
  "design-brand": () => import("./courses/design.js").then((mod) => mod.DESIGN_COURSES),
  "product-ba": () => import("./courses/product.js").then((mod) => mod.PRODUCT_COURSES),
  "product-pm": () => import("./courses/product.js").then((mod) => mod.PRODUCT_COURSES),
  "marketing-growth": () => import("./courses/marketing.js").then((mod) => mod.MARKETING_COURSES),
  "marketing-success": () => import("./courses/marketing.js").then((mod) => mod.MARKETING_COURSES),
  ba: () => import("./courses/product.js").then((mod) => mod.PRODUCT_COURSES),
  pm: () => import("./courses/product.js").then((mod) => mod.PRODUCT_COURSES),
  "se-platform": () => import("./courses/engineering-devops.js").then((mod) => mod.DEVOPS_COURSES),
  "ui-ux": () => import("./courses/design.js").then((mod) => mod.DESIGN_COURSES),
  "graphic-design": () => import("./courses/design.js").then((mod) => mod.DESIGN_COURSES),
  "ba-analyst": () => import("./courses/product.js").then((mod) => mod.PRODUCT_COURSES),
  "digital-marketing": () => import("./courses/marketing.js").then((mod) => mod.MARKETING_COURSES),
  "customer-success": () => import("./courses/marketing.js").then((mod) => mod.MARKETING_COURSES),
};

async function getPathModules(pathId) {
  if (!pathId || !INTERACTIVE_PATH_LOADERS[pathId]) return null;
  if (moduleCache.has(pathId)) return moduleCache.get(pathId);

  const modules = await INTERACTIVE_PATH_LOADERS[pathId]();
  moduleCache.set(pathId, modules || null);
  return modules || null;
}

export async function loadInteractiveLesson(pathId, moduleId, lessonId) {
  const modules = await getPathModules(pathId);
  return modules?.[moduleId]?.[lessonId] ?? null;
}

export function preloadInteractivePath(pathId) {
  if (!pathId || moduleCache.has(pathId) || !INTERACTIVE_PATH_LOADERS[pathId]) return Promise.resolve(null);
  return getPathModules(pathId);
}

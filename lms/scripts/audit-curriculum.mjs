import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PATHS } from '../src/data/structure.mjs';
import { loadInteractiveLesson, preloadInteractivePath } from '../src/data/interactive-courses.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const interactiveCoursesPath = path.resolve(__dirname, '../src/data/interactive-courses.js');
const interactiveSource = await fs.readFile(interactiveCoursesPath, 'utf8');

const issues = [];
const pathSummaries = [];
const canonicalPathIds = PATHS.map((item) => item.id);
const missingLoaderKeys = canonicalPathIds.filter((id) => !interactiveSource.includes(`"${id}"`));
if (missingLoaderKeys.length) {
  issues.push(...missingLoaderKeys.map((id) => ({ type: 'missing-loader', pathId: id })));
}

const hasUsableSandpack = (lab) => {
  if (!lab?.template || !lab?.files || !Object.keys(lab.files).length) return false;
  const serialized = JSON.stringify(lab);
  return !serialized.includes('>Setup<') && !serialized.includes('Setup</div>') && !serialized.includes('return <div>Setup</div>');
};

const hasUsablePractice = (practice) => {
  if (!practice?.kind || !practice?.titleEn || !practice?.titleBn) return false;
  return Boolean(
    (Array.isArray(practice.items) && practice.items.length) ||
    (Array.isArray(practice.entries) && practice.entries.length) ||
    (Array.isArray(practice.options) && practice.options.length) ||
    (Array.isArray(practice.sections) && practice.sections.length) ||
    practice.metrics
  );
};

for (const pathItem of PATHS) {
  await preloadInteractivePath(pathItem.id);
  let pathLessons = 0;
  for (const moduleItem of pathItem.modules || []) {
    for (const lesson of moduleItem.lessons || []) {
      pathLessons += 1;
      const payload = await loadInteractiveLesson(pathItem.id, moduleItem.id, lesson.id);
      if (!payload) {
        issues.push({ type: 'missing-lesson', pathId: pathItem.id, moduleId: moduleItem.id, lessonId: lesson.id });
        continue;
      }
      const missingFields = ['titleBn', 'titleEn', 'contentBn', 'contentEn', 'resources'].filter((field) => payload[field] == null || payload[field] === '');
      if (missingFields.length) {
        issues.push({ type: 'missing-fields', pathId: pathItem.id, moduleId: moduleItem.id, lessonId: lesson.id, missingFields });
      }
      if ((payload.resources || []).length < 3) {
        issues.push({ type: 'resource-gap', pathId: pathItem.id, moduleId: moduleItem.id, lessonId: lesson.id, count: (payload.resources || []).length });
      }
      if (!payload.resources?.every((resource) => /^https?:\/\//.test(resource?.url || ''))) {
        issues.push({ type: 'bad-resource-url', pathId: pathItem.id, moduleId: moduleItem.id, lessonId: lesson.id });
      }
      const sandpackReady = hasUsableSandpack(payload.sandpack);
      const practiceReady = hasUsablePractice(payload.practice);
      if (!sandpackReady && !practiceReady) {
        issues.push({ type: 'lab-gap', pathId: pathItem.id, moduleId: moduleItem.id, lessonId: lesson.id });
      }
      const labSource = JSON.stringify(payload.sandpack || {});
      if (sandpackReady === false && (labSource.includes('>Setup<') || labSource.includes('Setup</div>'))) {
        issues.push({ type: 'placeholder-lab', pathId: pathItem.id, moduleId: moduleItem.id, lessonId: lesson.id });
      }
      if (payload.practice && !practiceReady) {
        issues.push({ type: 'practice-gap', pathId: pathItem.id, moduleId: moduleItem.id, lessonId: lesson.id });
      }
      if (!String(payload.contentEn || '').includes(lesson.titleEn) || !String(payload.contentBn || '').includes(lesson.titleBn)) {
        issues.push({ type: 'title-mismatch', pathId: pathItem.id, moduleId: moduleItem.id, lessonId: lesson.id });
      }
    }
  }
  pathSummaries.push({ pathId: pathItem.id, modules: pathItem.modules.length, lessons: pathLessons });
}

const totals = pathSummaries.reduce((acc, item) => {
  acc.paths += 1;
  acc.modules += item.modules;
  acc.lessons += item.lessons;
  return acc;
}, { paths: 0, modules: 0, lessons: 0 });

const report = {
  totals,
  pathSummaries,
  issues,
};

console.log(JSON.stringify(report, null, 2));
if (issues.length) process.exit(1);

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { closeAdminApp, db, FieldValue } from "./shared/admin-app.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, "..", "content-template.json");

const slugify = (value, fallback) => {
  const slug = String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
};

const run = async () => {
  const raw = await readFile(templatePath, "utf8");
  const template = JSON.parse(raw);
  const courses = Array.isArray(template.courses) ? template.courses : [];

  let totalLessons = 0;

  for (let index = 0; index < courses.length; index += 1) {
    const course = courses[index];
    const baseTitle = course.titleEn || course.titleBn || course.title || `Course ${index + 1}`;
    const courseId = course.id || slugify(baseTitle, `course-${index + 1}`);
    const lessonsData = Array.isArray(course.lessonsData) ? course.lessonsData : [];
    const lessonsCount = Number.isFinite(Number(course.lessons))
      ? Number(course.lessons)
      : lessonsData.length;

    const payload = {
      title: course.title || baseTitle,
      titleBn: course.titleBn || "",
      titleEn: course.titleEn || "",
      desc: course.desc || course.descEn || course.descBn || "",
      descBn: course.descBn || "",
      descEn: course.descEn || "",
      level: course.level || "Beginner",
      lang: course.lang || "EN",
      badge: course.badge || course.badgeEn || course.badgeBn || "",
      badgeBn: course.badgeBn || "",
      badgeEn: course.badgeEn || "",
      lessons: lessonsCount,
      published: course.published !== false,
      updatedAt: FieldValue.serverTimestamp()
    };

    const courseRef = db.collection("courses").doc(courseId);
    await courseRef.set(payload, { merge: true });

    for (let idx = 0; idx < lessonsData.length; idx += 1) {
      const lesson = lessonsData[idx];
      const order = Number.isFinite(Number(lesson.order)) ? Number(lesson.order) : idx + 1;
      const lessonTitle = lesson.titleEn || lesson.titleBn || lesson.title || `Lesson ${order}`;
      const lessonId = lesson.id || slugify(lessonTitle, `lesson-${order}`);
      const lessonPayload = {
        title: lesson.title || lessonTitle,
        titleBn: lesson.titleBn || "",
        titleEn: lesson.titleEn || "",
        order,
        updatedAt: FieldValue.serverTimestamp()
      };
      await courseRef.collection("lessons").doc(lessonId).set(lessonPayload, { merge: true });
      totalLessons += 1;
    }
  }

  console.log(`Imported ${courses.length} courses and ${totalLessons} lessons.`);
  await closeAdminApp();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

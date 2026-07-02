import admin from "firebase-admin";

const projectId = process.env.FIREBASE_PROJECT_ID || "equisaas-bd";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId,
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const FieldValue = admin.firestore.FieldValue;
export const Timestamp = admin.firestore.Timestamp;
export const closeAdminApp = async () => {
  if (admin.apps.length) {
    await admin.app().delete();
  }
};
export default admin;

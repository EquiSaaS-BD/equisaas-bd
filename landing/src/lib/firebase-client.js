import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const REQUIRED_KEYS = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

function readFirebaseEnv() {
  const values = {};
  const missing = [];

  for (const key of REQUIRED_KEYS) {
    const value = import.meta.env[key];
    if (typeof value === "string" && value.trim() !== "") {
      values[key] = value.trim();
    } else {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    const message =
      "Missing required Firebase environment variables: " +
      missing.join(", ") +
      ". Copy .env.example to .env at the repo root and fill in the VITE_FIREBASE_* values.";
    throw new Error(message);
  }

  return {
    apiKey: values.VITE_FIREBASE_API_KEY,
    authDomain: values.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: values.VITE_FIREBASE_PROJECT_ID,
    storageBucket: values.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: values.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: values.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.trim() || undefined,
  };
}

const firebaseConfig = readFirebaseEnv();

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const firebaseProjectId = firebaseConfig.projectId;

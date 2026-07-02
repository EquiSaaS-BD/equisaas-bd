import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache } from "firebase/firestore";

const REQUIRED_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

function readFirebaseEnv() {
  const values = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  
  const missing = [];

  for (const key of REQUIRED_KEYS) {
    const value = values[key];
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
      ". Copy .env.example to .env at the repo root and fill in the NEXT_PUBLIC_FIREBASE_* values.";
    throw new Error(message);
  }

  return {
    apiKey: values.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: values.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: values.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: values.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: values.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: values.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim() || undefined,
  };
}

const firebaseConfig = readFirebaseEnv();

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use initializeFirestore to enable offline persistence cache
export const db = getApps().length
  ? getFirestore(app)
  : initializeFirestore(app, { localCache: persistentLocalCache() });
export const firebaseProjectId = firebaseConfig.projectId;

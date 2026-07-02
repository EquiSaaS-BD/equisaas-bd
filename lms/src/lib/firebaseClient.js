import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCXB2kGtYmKxyvSdnvMwybn9wzDge4Ygss",
  authDomain: "equisaas-bd.firebaseapp.com",
  projectId: "equisaas-bd",
  storageBucket: "equisaas-bd.firebasestorage.app",
  messagingSenderId: "939634736257",
  appId: "1:939634736257:web:a2c1b5cbc4958c2505e180",
  measurementId: "G-DM7GQCNLFE",
};

export const isConfigured = Object.values(firebaseConfig).every(
  (value) => value && !String(value).includes("YOUR_")
);

export const app = isConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

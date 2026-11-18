import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True once the Firebase keys are filled in `.env.local`. Until then the site shows demo data. */
export const firebaseReady = Boolean(config.apiKey && config.projectId && config.appId);

let app: FirebaseApp | undefined;
function firebaseApp(): FirebaseApp {
  if (!firebaseReady) throw new Error("Firebase is not configured. Fill in .env.local (see .env.example).");
  if (!app) app = getApps().length ? getApp() : initializeApp(config);
  return app;
}

export const db = (): Firestore => getFirestore(firebaseApp());
export const auth = (): Auth => getAuth(firebaseApp());

/* eslint-disable @typescript-eslint/no-require-imports */
import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ← Add this import

// Dynamically get React Native persistence to avoid TypeScript errors
let getReactNativePersistence: any;
try {
  const authModule = require("firebase/auth");
  getReactNativePersistence = authModule.getReactNativePersistence;
} catch {
  // Fallback if module structure is different
  getReactNativePersistence = () => browserLocalPersistence;
}

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth with proper persistence handling
export const auth = (() => {
  try {
    // Prefer AsyncStorage-based persistence on React Native if available
    let persistence = browserLocalPersistence;

    try {
      // Dynamic require so the app still runs if the package isn't installed
      const RNAsyncStorage =
        require("@react-native-async-storage/async-storage").default;

      if (RNAsyncStorage && getReactNativePersistence) {
        persistence = getReactNativePersistence(RNAsyncStorage as any);
      } else {
      }
    } catch {
      // Package not installed or require failed — fall back to browserLocalPersistence
    }

    const authInstance = initializeAuth(app, {
      persistence,
    });

    return authInstance;
  } catch (e: any) {
    // Fallback to regular getAuth if initializeAuth is not available or already initialized
    if (e.code === "auth/already-initialized") {
      return getAuth(app);
    }
    console.error("❌ Error initializing auth:", e);
    return getAuth(app);
  }
})();

// Initialize Firestore
export const db = getFirestore(app); // ← Add this export

export default app;

/**
 * @fileoverview This file serves as the central hub for Firebase initialization and exports.
 * It provides memoized (singleton) instances of the Firebase App, Auth, and Firestore services
 * to ensure they are initialized only once. It also re-exports key providers and hooks
 * for easy importing throughout the application.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Provides a memoized Firebase app instance to prevent re-initialization.
let app: FirebaseApp;
export function getFirebaseApp() {
  if (app) return app;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  return app;
}

// Provides a memoized Firebase Auth instance.
let auth: Auth;
export function getFirebaseAuth() {
  if (auth) return auth;
  auth = getAuth(getFirebaseApp());
  return auth;
}

// Provides a memoized Firestore instance.
let firestore: Firestore;
export function getFirebaseFirestore() {
  if (firestore) return firestore;
  firestore = getFirestore(getFirebaseApp());
  return firestore;
}

/**
 * A convenience function to initialize and get all core Firebase services at once.
 * @returns {{app: FirebaseApp, auth: Auth, firestore: Firestore}}
 */
export function initializeFirebase() {
  const app = getFirebaseApp();
  const auth = getFirebaseAuth();
  const firestore = getFirebaseFirestore();
  return { app, auth, firestore };
}

// Re-exporting providers and hooks for convenient access from other parts of the app.
export {
  FirebaseProvider,
  useFirebaseApp,
  useFirestore,
  useAuth,
} from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';

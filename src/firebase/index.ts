import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Provides a memoized Firebase app instance
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

// Provides a memoized Firebase Auth instance
let auth: Auth;
export function getFirebaseAuth() {
  if (auth) return auth;
  auth = getAuth(getFirebaseApp());
  return auth;
}

// Provides a memoized Firestore instance
let firestore: Firestore;
export function getFirebaseFirestore() {
  if (firestore) return firestore;
  firestore = getFirestore(getFirebaseApp());
  return firestore;
}

export function initializeFirebase() {
  const app = getFirebaseApp();
  const auth = getFirebaseAuth();
  const firestore = getFirebaseFirestore();
  return { app, auth, firestore };
}

export {
  FirebaseProvider,
  useFirebaseApp,
  useFirestore,
  useAuth,
} from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';

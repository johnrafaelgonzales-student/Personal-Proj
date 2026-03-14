/**
 * @fileoverview This file defines the main Firebase context provider.
 * It initializes the Firebase app, auth, and firestore services and makes them
 * available to all child components via React's Context API. It also includes
 * the `FirebaseErrorListener` to handle permission errors globally.
 */
'use client';
import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { getFirebaseApp, getFirebaseAuth, getFirebaseFirestore } from '.';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

// Defines the shape of the context value.
export type FirebaseContextValue = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

// Creates the React context.
const FirebaseContext = createContext<FirebaseContextValue | undefined>(
  undefined
);

/**
 * The provider component that supplies the Firebase context to its children.
 */
export function FirebaseProvider({
  children,
}: PropsWithChildren<{}>) {
  // `useMemo` ensures that the Firebase services are initialized only once per render.
  const contextValue = useMemo(() => {
    const app = getFirebaseApp();
    const auth = getFirebaseAuth();
    const firestore = getFirebaseFirestore();
    return { app, auth, firestore };
  }, []);

  return (
    <FirebaseContext.Provider value={contextValue}>
      {/* The listener for handling global Firebase errors. */}
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
}

// Custom hooks to easily access the Firebase context and its values.
export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
  return useFirebase().app;
}

export function useAuth() {
  return useFirebase().auth;
}

export function useFirestore() {
  return useFirebase().firestore;
}

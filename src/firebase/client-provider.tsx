/**
 * @fileoverview This component acts as a client-side wrapper for the main FirebaseProvider.
 * It ensures that the Firebase context is initialized and available to all child components
 * that are rendered on the client.
 */
'use client';
import { type PropsWithChildren } from 'react';
import { FirebaseProvider } from './provider';

/**
 * Wraps the main FirebaseProvider to ensure it's only rendered on the client.
 * @param {PropsWithChildren} props - Component props containing children to render.
 */
export function FirebaseClientProvider({ children }: PropsWithChildren) {
  return <FirebaseProvider>{children}</FirebaseProvider>;
}

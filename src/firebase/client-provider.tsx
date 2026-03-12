'use client';
import { type PropsWithChildren } from 'react';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({ children }: PropsWithChildren) {
  return <FirebaseProvider>{children}</FirebaseProvider>;
}

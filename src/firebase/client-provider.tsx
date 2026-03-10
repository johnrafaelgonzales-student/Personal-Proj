'use client';
import { type PropsWithChildren } from 'react';
import { FirebaseProvider } from './provider';
import { UserProvider } from './auth/use-user';

export function FirebaseClientProvider({ children }: PropsWithChildren) {
  return (
    <FirebaseProvider>
      <UserProvider>{children}</UserProvider>
    </FirebaseProvider>
  );
}

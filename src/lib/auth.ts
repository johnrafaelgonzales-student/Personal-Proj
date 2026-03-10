'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import type { SignUpFormValues } from '@/app/(auth)/register/page';
import { getFirebaseAuth, getFirebaseFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export async function signUp(values: SignUpFormValues): Promise<User> {
  const auth = getFirebaseAuth();
  const { email, password, name, role } = values;
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  const db = getFirebaseFirestore();
  const userProfile = {
    id: user.uid,
    name: name,
    email: user.email,
    role: role,
  };

  const collectionName = role === 'admin' ? 'admins' : 'registeredVisitors';
  const userDocRef = doc(db, collectionName, user.uid);

  setDoc(userDocRef, userProfile).catch((serverError) => {
    const permissionError = new FirestorePermissionError({
      path: userDocRef.path,
      operation: 'create',
      requestResourceData: userProfile,
    });
    errorEmitter.emit('permission-error', permissionError);
  });

  return user;
}

export async function signIn(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}

export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  return firebaseSignOut(auth);
}

'use client';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import type { SignUpFormValues } from '@/app/(auth)/register/page';
import { initializeFirebase } from '@/firebase';

const { app } = initializeFirebase();
const auth = getAuth(app);
const db = getFirestore(app);

export async function signUp(values: SignUpFormValues): Promise<User> {
  const { email, password, name, role } = values;
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  const userProfile = {
    id: user.uid,
    name: name,
    email: user.email,
    role: role,
  };

  const collectionName = role === 'admin' ? 'admins' : 'registeredVisitors';
  await setDoc(doc(db, collectionName, user.uid), userProfile);

  return user;
}

export async function signIn(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}

export async function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}

/**
 * @fileoverview This file defines the `useDoc` hook, a custom React hook for subscribing
 * to a single Firestore document in real-time.
 */
'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  type DocumentReference,
  type DocumentData,
  type FirestoreError,
  type DocumentSnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Defines the return type for the hook.
interface UseDocReturn<T> {
  data: T | null;
  loading: boolean;
  error: FirestoreError | null;
}

/**
 * A custom hook to listen for real-time updates on a single Firestore document.
 * @param {DocumentReference<T, DocumentData> | null} ref - The Firestore document reference to listen to.
 * @returns {UseDocReturn<T>} An object containing the document data, loading state, and any errors.
 */
export function useDoc<T>(
  ref: DocumentReference<T, DocumentData> | null
): UseDocReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!ref) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot: DocumentSnapshot<T>) => {
        // If the document exists, set its data. Otherwise, set data to null.
        if (snapshot.exists()) {
          setData(snapshot.data());
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      async (err: FirestoreError) => {
        // If a permission-denied error occurs, emit a custom, more detailed error.
        if (err.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path: ref.path,
            operation: 'get',
          });
          errorEmitter.emit('permission-error', permissionError);
        }
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup function to unsubscribe from the listener on unmount.
    return () => unsubscribe();
  }, [ref]); // Re-run the effect if the document reference changes.

  return { data, loading, error };
}

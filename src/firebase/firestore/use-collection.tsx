/**
 * @fileoverview This file defines the `useCollection` hook, a custom React hook for subscribing
 * to a Firestore collection in real-time. It handles loading, data, and error states.
 */
'use client';

import { useState, useEffect } from 'react';
import {
  onSnapshot,
  type Query,
  type DocumentData,
  type FirestoreError,
  type QuerySnapshot,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Defines the return type for the hook.
interface UseCollectionReturn<T> {
  data: T[] | null;
  loading: boolean;
  error: FirestoreError | null;
}

/**
 * A custom hook to listen for real-time updates on a Firestore collection.
 * @param {Query<T, DocumentData> | null} query - The Firestore query to listen to. If null, the hook does nothing.
 * @returns {UseCollectionReturn<T>} An object containing the collection data, loading state, and any errors.
 */
export function useCollection<T>(
  query: Query<T, DocumentData> | null
): UseCollectionReturn<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    // If the query is null, don't attempt to fetch data.
    if (!query) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    // `onSnapshot` sets up the real-time listener.
    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<T>) => {
        // On successful update, map the documents to their data.
        const documents = snapshot.docs.map((doc) => doc.data());
        setData(documents);
        setLoading(false);
        setError(null);
      },
      async (err: FirestoreError) => {
        // If a permission-denied error occurs, emit a custom, more detailed error.
        if (err.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path: 'path' in query ? (query as any).path : 'unknown collection query path',
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
        }
        setError(err);
        setLoading(false);
      }
    );

    // The cleanup function returned by useEffect will unsubscribe from the listener
    // when the component unmounts or the query changes.
    return () => unsubscribe();
  }, [query]); // The effect re-runs whenever the query object changes.

  return { data, loading, error };
}

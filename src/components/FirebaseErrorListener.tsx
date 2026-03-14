/**
 * @fileoverview This component acts as a global listener for Firestore permission errors.
 * In development, it throws an error to show the Next.js error overlay with detailed context.
 * In production, it displays a user-friendly toast notification.
 */
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * A non-rendering component that subscribes to Firebase permission errors.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    // Defines the handler for a permission error.
    const handleError = (error: FirestorePermissionError) => {
      // In development, throw the error to leverage the Next.js error overlay
      // for a rich debugging experience.
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          throw error;
        }, 0);
      } else {
        // In production, show a generic, user-friendly error toast.
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'You do not have permission to perform this action.',
        });
      }
    };

    // Subscribes to the 'permission-error' event on the global emitter.
    errorEmitter.on('permission-error', handleError);

    // Unsubscribes from the event when the component unmounts to prevent memory leaks.
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  // This component does not render any UI.
  return null;
}

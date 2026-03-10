'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth } from '../provider';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

interface UserData extends User {
  role?: 'admin' | 'visitor';
}

interface UserContextType {
  user: UserData | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const db = getFirestore(auth.app);
          const adminRef = doc(db, 'admins', firebaseUser.uid);
          const visitorRef = doc(db, 'registeredVisitors', firebaseUser.uid);

          const [adminResult, visitorResult] = await Promise.allSettled([
            getDoc(adminRef),
            getDoc(visitorRef),
          ]);

          let role: 'admin' | 'visitor' | undefined = undefined;

          if (adminResult.status === 'fulfilled' && adminResult.value.exists()) {
            role = 'admin';
          } else if (
            visitorResult.status === 'fulfilled' &&
            visitorResult.value.exists()
          ) {
            role = 'visitor';
          }

          setUser({ ...firebaseUser, role });
        } catch (error) {
          console.error('Error fetching user role:', error);
          // Set user without a role if fetching fails
          setUser(firebaseUser);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

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
        const db = getFirestore(auth.app);
        
        // Check admin collection first
        let userDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
        let role: 'admin' | 'visitor' | undefined = undefined;

        if (userDoc.exists()) {
          role = 'admin';
        } else {
          // Check registeredVisitors collection if not found in admin
          userDoc = await getDoc(doc(db, 'registeredVisitors', firebaseUser.uid));
          if (userDoc.exists()) {
            role = 'visitor';
          }
        }
        
        setUser({ ...firebaseUser, role });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

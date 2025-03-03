"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { AuthContextType, UserData } from "@/types/user";
import { auth, db } from "@/firebase/config";

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signOut: async () => {},
});

import { toast } from "sonner";

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!error) return;

    toast.error("Uh oh! Something went wrong.", {
      description: error.message,
    });

    setError(null);
  }, [error]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in, fetch additional data from Firestore
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<UserData, "uid">;
            setUser({
              uid: firebaseUser.uid,
              ...userData,
            });
          } else {
            // Handle case where user exists in Auth but not in Firestore
            throw new Error("User document not found in Firestore");
            setUser(null);
          }
        } else {
          // User is signed out
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Error signing out:", err);
      setError(
        err instanceof Error ? err : new Error("Unknown error during sign out")
      );
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

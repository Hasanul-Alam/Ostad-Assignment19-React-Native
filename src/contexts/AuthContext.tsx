// src/contexts/AuthContext.tsx
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../configurations/firebase";

// Auth Context Type
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create Context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sign up
  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential;
  };

  // Sign in
  const signIn = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Error message helper
export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already registered";
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters";
    case "auth/user-not-found":
      return "No account found with this email";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/invalid-credential":
      return "Invalid email or password";
    case "auth/too-many-requests":
      return "Too many failed attempts. Try again later";
    default:
      return "An error occurred. Please try again";
  }
};

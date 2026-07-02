"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { canAwardPoints, canManage, canReview, getPrimaryRole, getRoleList, roleLabels } from "@/lib/catalog";
import { ensureUserProfile } from "@/lib/firestore/lms";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const startProfileSubscription = (uid, onDone) =>
    onSnapshot(
      doc(db, "users", uid),
      (snap) => {
        onDone(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      },
      () => {
        onDone(null);
      },
    );

  useEffect(() => {
    let profileUnsubscribe = null;

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (profileUnsubscribe) {
        profileUnsubscribe();
        profileUnsubscribe = null;
      }

      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        await ensureUserProfile(nextUser);
        profileUnsubscribe = startProfileSubscription(nextUser.uid, (nextProfile) => {
          setProfile(nextProfile);
          setLoading(false);
        });
      } catch (error) {
        console.error("Failed to initialize user profile", error);
        profileUnsubscribe = startProfileSubscription(nextUser.uid, (nextProfile) => {
          setProfile(nextProfile);
          setLoading(false);
        });
      }
    });

    return () => {
      unsubscribe();
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, []);

  const value = useMemo(() => {
    const roles = getRoleList(profile);
    const role = getPrimaryRole(profile);
    return {
      user,
      profile,
      loading,
      role,
      roles,
      roleLabels: roleLabels(roles),
      hasRole: (roleId) => roles.includes(roleId),
      isAuthenticated: Boolean(user),
      canManage: canManage(roles),
      canReview: canReview(roles),
      canAwardPoints: canAwardPoints(roles),
      register: (email, password) => createUserWithEmailAndPassword(auth, email, password),
      login: (email, password) => signInWithEmailAndPassword(auth, email, password),
      loginWithGoogle: () => signInWithPopup(auth, new GoogleAuthProvider()),
      logout: () => signOut(auth),
    };
  }, [loading, profile, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

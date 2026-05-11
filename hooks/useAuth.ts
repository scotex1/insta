'use client';
import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { getUserProfile } from '@/lib/utils';
import type { User } from '@/lib/api';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  profile: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setProfile: (p: User | null) => void;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  firebaseUser: null,
  profile: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ firebaseUser: user }),
  setProfile: (p)   => set({ profile: p }),

  refreshProfile: async () => {
    const { firebaseUser } = get();
    if (!firebaseUser) return;
    const p = await getUserProfile(firebaseUser.uid);
    set({ profile: p });
  },

  signIn: async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  signUp: async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const trialEnd = new Date(Date.now() + 7 * 86400000);
    await setDoc(doc(db, 'users', cred.user.uid), {
      name,
      email,
      plan: 'free',
      bot_active: true,
      ig_connected: false,
      trial_ends_at: trialEnd,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
  },

  signInGoogle: async () => {
    const provider = new GoogleAuthProvider();
    const cred     = await signInWithPopup(auth, provider);
    const snap      = await getDoc(doc(db, 'users', cred.user.uid));
    if (!snap.exists()) {
      const trialEnd = new Date(Date.now() + 7 * 86400000);
      await setDoc(doc(db, 'users', cred.user.uid), {
        name:          cred.user.displayName || '',
        email:         cred.user.email || '',
        plan:          'free',
        bot_active:    true,
        ig_connected:  false,
        trial_ends_at: trialEnd,
        created_at:    serverTimestamp(),
        updated_at:    serverTimestamp(),
      });
    }
  },

  signOut: async () => {
    await firebaseSignOut(auth);
    set({ firebaseUser: null, profile: null });
  },

  resetPassword: async (email) => {
    await sendPasswordResetEmail(auth, email);
  },
}));

// Initialize auth listener (call once in root layout)
export function initAuth() {
  return onAuthStateChanged(auth, async (user) => {
    const store = useAuth.getState();
    store.setUser(user);
    if (user) {
      const p = await getUserProfile(user.uid);
      store.setProfile(p);
    } else {
      store.setProfile(null);
    }
    useAuth.setState({ loading: false, initialized: true });
  });
}

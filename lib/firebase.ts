import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY       || 'placeholder',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN   || 'placeholder.firebaseapp.com',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID    || 'placeholder',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'placeholder.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'placeholder',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID        || 'placeholder',
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Only initialize on client side
if (typeof window !== 'undefined') {
  app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db   = getFirestore(app);
} else {
  // SSR stubs — pages using Firebase must be 'use client'
  app  = {} as FirebaseApp;
  auth = {} as Auth;
  db   = {} as Firestore;
}

export { auth, db };
export default app;

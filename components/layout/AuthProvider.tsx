'use client';
import { useEffect } from 'react';
import { initAuth } from '@/hooks/useAuth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsub = initAuth();
    return () => unsub();
  }, []);
  return <>{children}</>;
}

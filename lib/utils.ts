import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { User } from './api';

export async function getUserProfile(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as User) : null;
}

export function getPlanStatus(profile: User | null) {
  if (!profile) return { plan: 'free', active: false, expired: true, daysLeft: 0, isPaid: false, isTrial: false };
  const now       = Date.now();
  const trialEnd  = (profile.trial_ends_at as any)?._seconds ? (profile.trial_ends_at as any)._seconds * 1000 : 0;
  const paidEnd   = (profile.paid_until as any)?._seconds   ? (profile.paid_until as any)._seconds * 1000    : 0;
  const isPaid    = paidEnd > now;
  const isTrial   = !isPaid && trialEnd > now;
  const daysLeft  = isPaid
    ? Math.ceil((paidEnd - now) / 86400000)
    : isTrial ? Math.ceil((trialEnd - now) / 86400000) : 0;
  return { plan: isPaid ? 'paid' : 'free', active: isPaid || isTrial, expired: !isPaid && !isTrial, isPaid, isTrial, daysLeft };
}

export function tsToDate(ts: { _seconds: number } | undefined): Date | null {
  if (!ts?._seconds) return null;
  return new Date(ts._seconds * 1000);
}

export function timeAgo(ts: { _seconds: number } | undefined): string {
  const d = tsToDate(ts);
  if (!d) return '—';
  const diff = Date.now() - d.getTime();
  if (diff < 60000)   return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export function formatDate(ts: { _seconds: number } | undefined): string {
  const d = tsToDate(ts);
  return d ? d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
}

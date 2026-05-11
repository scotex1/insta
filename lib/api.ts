import { auth } from './firebase';

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

async function getToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data as T;
}

// ─── Leads ─────────────────────────────────────────────────────
export const api = {
  leads: {
    list: (params?: { limit?: number; offset?: number; status?: string }) =>
      apiFetch<{ leads: Lead[]; count: number }>('/api/leads?' + new URLSearchParams(params as Record<string, string>)),
    stats: () => apiFetch<{ total: number; converted: number; conversionRate: number }>('/api/leads/stats'),
  },
  templates: {
    list: () => apiFetch<{ templates: Template[]; plan: string; limit: number; count: number }>('/api/templates'),
    create: (data: Partial<Template>) => apiFetch<{ id: string }>('/api/templates', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Template>) => apiFetch<{}>(`/api/templates/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<{}>(`/api/templates/${id}`, { method: 'DELETE' }),
    setDefault: (id: string) => apiFetch<{}>(`/api/templates/${id}/set-default`, { method: 'POST' }),
  },
  payment: {
    createOrder: () => apiFetch<{ orderId: string; amount: number; currency: string }>('/api/payment/create-order', { method: 'POST' }),
    verify: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
      apiFetch<{ paid_until: string }>('/api/payment/verify', { method: 'POST', body: JSON.stringify(data) }),
  },
  instagram: {
    status: () => apiFetch<{ ig_connected: boolean; ig_page_name: string | null; bot_active: boolean }>('/auth/meta/status'),
    disconnect: () => apiFetch<{}>('/auth/meta/disconnect', { method: 'POST' }),
    getLoginUrl: () => `${BASE}/auth/meta/login`,
  },
  admin: {
    stats: () => apiFetch<AdminStats>('/api/admin/stats'),
    users: (params?: { limit?: number; offset?: number }) =>
      apiFetch<{ users: User[] }>('/api/admin/users?' + new URLSearchParams(params as Record<string, string>)),
    leads: (params?: { limit?: number; offset?: number }) =>
      apiFetch<{ leads: Lead[]; total: number }>('/api/admin/leads?' + new URLSearchParams(params as Record<string, string>)),
    payments: (params?: { limit?: number; offset?: number }) =>
      apiFetch<{ payments: Payment[] }>('/api/admin/payments?' + new URLSearchParams(params as Record<string, string>)),
    grantPro: (uid: string, days?: number) =>
      apiFetch<{}>(`/api/admin/users/${uid}/grant-pro`, { method: 'POST', body: JSON.stringify({ days }) }),
    toggleBot: (uid: string) => apiFetch<{ bot_active: boolean }>(`/api/admin/users/${uid}/toggle-bot`, { method: 'POST' }),
    suspend: (uid: string) => apiFetch<{}>(`/api/admin/users/${uid}/suspend`, { method: 'POST' }),
  },
};

// Types
export interface Lead {
  id: string;
  ig_user_id: string;
  name?: string;
  business_type?: string;
  product?: string;
  budget?: string;
  interest?: string;
  status: 'active' | 'converted';
  flow?: string;
  created_at: { _seconds: number };
  updated_at: { _seconds: number };
}

export interface Template {
  id: string;
  name: string;
  is_default: boolean;
  plan_type: string;
  steps: { id: number; hi: string; en: string; save: string | null }[];
  triggers?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan?: string;
  bot_active?: boolean;
  ig_connected?: boolean;
  ig_page_name?: string;
  is_admin?: boolean;
  paid_until?: { _seconds: number };
  trial_ends_at?: { _seconds: number };
  leadCount?: number;
}

export interface Payment {
  id: string;
  uid: string;
  userName: string;
  userEmail: string;
  amount: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  paid_until: string;
  created_at: { _seconds: number };
}

export interface AdminStats {
  totalUsers: number;
  activePaid: number;
  activeTrial: number;
  mrr: number;
  totalRevenue: number;
  totalPayments: number;
  igConnected: number;
  botActive: number;
}

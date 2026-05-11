import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/layout/AuthProvider';

export const metadata: Metadata = {
  title: 'LeadMachine — Instagram DM Automation for India',
  description: 'Instagram DMs automatically leads mein convert karo. 7 din free trial. Made in India.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: '#171724', color: '#f0f0f8', border: '1px solid rgba(255,255,255,0.13)', borderRadius: '12px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px' },
            success: { iconTheme: { primary: '#00ff88', secondary: '#171724' } },
            error:   { iconTheme: { primary: '#ff3b3b', secondary: '#171724' } },
          }}
        />
      </body>
    </html>
  );
}

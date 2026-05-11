'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
export default function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { refreshProfile } = useAuth();
  useEffect(() => {
    const success = params.get('success');
    const error   = params.get('error');
    if (success === '1') { toast.success('Instagram connected! 🎉'); refreshProfile(); }
    else toast.error(error || 'Instagram connect failed');
    router.replace('/dashboard');
  }, []);
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16}}>
      <div style={{width:40,height:40,borderRadius:'50%',border:'3px solid rgba(255,255,255,.1)',borderTopColor:'var(--saffron)',animation:'spin .65s linear infinite'}}/>
      <p style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:'var(--w3)'}}>Redirecting...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

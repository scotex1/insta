'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent]   = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Reset email bheja gaya!');
    } catch (err: any) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'32px 16px',position:'relative',zIndex:1 }}>
      <div style={{ width:'100%',maxWidth:400 }}>
        <div className="rise d1" style={{ textAlign:'center',marginBottom:32 }}>
          <Link href="/" style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2,color:'var(--w)',textDecoration:'none' }}>
            <span style={{ color:'var(--saffron)' }}>L</span>EAD<span style={{ color:'var(--saffron)' }}>M</span>ACHINE
          </Link>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:36,marginTop:16,marginBottom:6 }}>PASSWORD RESET</h1>
          <p style={{ fontSize:14,color:'var(--w3)' }}>Email daalo, hum link bhejenge</p>
        </div>
        <div className="rise d2" style={{ background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:16,padding:32 }}>
          {sent ? (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:48,marginBottom:16 }}>📧</div>
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:28,marginBottom:8 }}>EMAIL BHEJA GAYA!</h3>
              <p style={{ fontSize:14,color:'var(--w2)',marginBottom:20 }}>{email} par reset link bheja gaya। Inbox check karo।</p>
              <Link href="/login" style={{ color:'var(--saffron)',textDecoration:'none',fontSize:14,fontWeight:700 }}>← Login par wapas jao</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:20 }}>
                <label style={{ display:'block',marginBottom:7,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'var(--w3)' }}>Email</label>
                <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
                  style={{ width:'100%',background:'var(--ink3)',border:'1px solid var(--edge2)',borderRadius:6,padding:'11px 14px',color:'var(--w)',fontSize:14,outline:'none' }} />
              </div>
              <button type="submit" disabled={loading} style={{ width:'100%',background:'var(--saffron)',color:'#000',fontWeight:700,fontSize:14,padding:'12px',borderRadius:8,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                {loading ? 'Sending...' : 'RESET LINK BHEJO'}
              </button>
              <p style={{ textAlign:'center',marginTop:16 }}><Link href="/login" style={{ fontSize:13,color:'var(--w3)',textDecoration:'none' }}>← Login par wapas</Link></p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

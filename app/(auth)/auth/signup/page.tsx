'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');
  const [pass, setPass]     = useState('');
  const [loading, setLoading] = useState(false);
  const [gloading, setGloading] = useState(false);
  const { signUp, signInGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pass.length < 6) { toast.error('Password 6+ characters hona chahiye'); return; }
    setLoading(true);
    try {
      await signUp(name, email, pass);
      toast.success('Account bana! 7 din free trial shuru! 🎉');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message.includes('already') ? 'Ye email already registered hai' : err.message);
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setGloading(true);
    try {
      await signInGoogle();
      toast.success('Welcome! 🎉');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message);
    } finally { setGloading(false); }
  };

  return (
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'32px 16px',position:'relative',zIndex:1 }}>
      <div style={{ width:'100%',maxWidth:440 }}>
        <div className="rise d1" style={{ textAlign:'center',marginBottom:32 }}>
          <Link href="/" style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2,color:'var(--w)',textDecoration:'none' }}>
            <span style={{ color:'var(--saffron)' }}>L</span>EAD<span style={{ color:'var(--saffron)' }}>M</span>ACHINE
          </Link>
          <div style={{ display:'inline-flex',alignItems:'center',gap:6,background:'rgba(0,255,136,.08)',border:'1px solid rgba(0,255,136,.2)',color:'var(--green)',fontSize:11,fontWeight:700,padding:'5px 12px',borderRadius:20,marginTop:12,marginBottom:8 }}>
            ✓ 7 DIN FREE TRIAL · NO CARD REQUIRED
          </div>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:40,marginTop:8,marginBottom:6 }}>ACCOUNT BANAO</h1>
          <p style={{ fontSize:14,color:'var(--w3)' }}>5 minutes mein setup ho jaata hai</p>
        </div>

        <div className="rise d2" style={{ background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:16,padding:32 }}>
          <button onClick={handleGoogle} disabled={gloading} style={{ width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:10,background:'var(--ink3)',border:'1px solid var(--edge2)',borderRadius:8,padding:'11px 20px',color:'var(--w)',fontSize:14,fontWeight:600,cursor:'pointer',marginBottom:20 }}>
            {gloading ? <span className="spinner" /> : <>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google se Signup
            </>}
          </button>

          <div style={{ display:'flex',alignItems:'center',gap:12,color:'var(--w3)',fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase',margin:'0 0 20px' }}>
            <span style={{ flex:1,height:1,background:'var(--edge)' }}/>OR<span style={{ flex:1,height:1,background:'var(--edge)' }}/>
          </div>

          <form onSubmit={handleSubmit}>
            {[
              { label:'Aapka Naam',type:'text',val:name,set:setName,ph:'Rahul Sharma' },
              { label:'Email',type:'email',val:email,set:setEmail,ph:'your@email.com' },
              { label:'Password (6+ chars)',type:'password',val:pass,set:setPass,ph:'••••••••' },
            ].map(({label,type,val,set,ph})=>(
              <div key={label} style={{ marginBottom:16 }}>
                <label style={{ display:'block',marginBottom:7,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'var(--w3)' }}>{label}</label>
                <input type={type} placeholder={ph} required value={val} onChange={e=>set(e.target.value)}
                  style={{ width:'100%',background:'var(--ink3)',border:'1px solid var(--edge2)',borderRadius:6,padding:'11px 14px',color:'var(--w)',fontFamily:"'DM Sans',sans-serif",fontSize:14,outline:'none' }} />
              </div>
            ))}
            <button type="submit" disabled={loading} style={{ width:'100%',background:'var(--saffron)',color:'#000',fontWeight:700,fontSize:14,padding:'12px',borderRadius:8,border:'none',cursor:loading?'not-allowed':'pointer',opacity:loading?.6:1,display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginTop:4 }}>
              {loading ? <><span className="spinner" style={{ borderTopColor:'#000' }}/> Creating...</> : '🚀 FREE TRIAL SHURU KARO'}
            </button>
            <p style={{ fontSize:11,color:'var(--w3)',textAlign:'center',marginTop:12,lineHeight:1.5 }}>
              Sign up karne ka matlab hai aap hamare <Link href="/terms" style={{ color:'var(--saffron)',textDecoration:'none' }}>Terms</Link> aur <Link href="/privacy" style={{ color:'var(--saffron)',textDecoration:'none' }}>Privacy Policy</Link> se agree karte hain।
            </p>
          </form>
        </div>

        <p className="rise d3" style={{ textAlign:'center',marginTop:20,fontSize:14,color:'var(--w3)' }}>
          Already account hai? <Link href="/login" style={{ color:'var(--saffron)',textDecoration:'none',fontWeight:700 }}>Login →</Link>
        </p>
      </div>
      <style>{`.spinner{width:16px;height:16px;border-radius:50%;border:2px solid rgba(0,0,0,.2);border-top-color:#000;animation:spin .65s linear infinite;display:inline-block}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

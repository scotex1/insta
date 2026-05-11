'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { api, type AdminStats, type User, type Lead, type Payment } from '@/lib/api';
import { timeAgo } from '@/lib/utils';
import toast from 'react-hot-toast';

type Tab = 'stats' | 'users' | 'leads' | 'payments';

export default function AdminPage() {
  const { firebaseUser, profile, signOut } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!firebaseUser) { router.push('/login'); return; }
      if (profile && !profile.is_admin) { router.push('/dashboard'); return; }
    }, 1200);
    return () => clearTimeout(t);
  }, [firebaseUser, profile, router]);

  const load = useCallback(async () => {
    if (!firebaseUser || !profile?.is_admin) return;
    setLoading(true);
    try {
      const [s, u, l, p] = await Promise.allSettled([
        api.admin.stats(), api.admin.users({ limit: 100 }),
        api.admin.leads({ limit: 100 }), api.admin.payments({ limit: 100 }),
      ]);
      if (s.status === 'fulfilled') setStats(s.value);
      if (u.status === 'fulfilled') setUsers(u.value.users);
      if (l.status === 'fulfilled') setLeads(l.value.leads);
      if (p.status === 'fulfilled') setPayments(p.value.payments);
    } catch (_) {}
    setLoading(false);
  }, [firebaseUser, profile]);

  useEffect(() => { load(); }, [load]);

  const grantPro = async (uid: string) => { await api.admin.grantPro(uid, 30); toast.success('Pro granted!'); load(); };
  const toggleBot = async (uid: string) => { await api.admin.toggleBot(uid); toast.success('Bot toggled'); load(); };
  const suspend = async (uid: string) => {
    if (!confirm('Suspend this user?')) return;
    await api.admin.suspend(uid); toast.success('Suspended'); load();
  };

  const th: React.CSSProperties = { fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--w3)',padding:'10px 16px',textAlign:'left' as const,background:'rgba(255,255,255,.02)' };
  const td: React.CSSProperties = { padding:'11px 16px',fontSize:13,borderBottom:'1px solid var(--edge)',verticalAlign:'middle' as const };

  if (!firebaseUser || (profile && !profile.is_admin)) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--w3)'}}>
      <div style={{textAlign:'center' as const}}><div style={{fontSize:48,marginBottom:12}}>🔒</div><div>Admin access required</div></div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'var(--ink)',position:'relative',zIndex:1}}>
      <nav style={{position:'sticky',top:0,zIndex:300,borderBottom:'1px solid var(--edge)',background:'rgba(8,8,16,0.95)',backdropFilter:'blur(20px)',height:60,display:'flex',alignItems:'center',padding:'0 32px',justifyContent:'space-between'}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2}}>
          <span style={{color:'var(--saffron)'}}>L</span>M <span style={{fontSize:14,color:'var(--w3)',letterSpacing:1}}>ADMIN</span>
        </div>
        <button onClick={() => { signOut(); router.push('/'); }} style={{background:'none',border:'1px solid var(--edge)',color:'var(--w3)',fontSize:12,padding:'5px 12px',borderRadius:6,cursor:'pointer'}}>Logout</button>
      </nav>

      <div style={{display:'flex',minHeight:'calc(100vh - 60px)'}}>
        <aside style={{width:200,borderRight:'1px solid var(--edge)',padding:'20px 10px',background:'var(--ink)',flexShrink:0}}>
          {(['stats','users','leads','payments'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 12px',borderRadius:6,background:tab===t?'var(--saffron-dim)':'none',border:'none',cursor:'pointer',color:tab===t?'var(--saffron)':'var(--w2)',fontSize:13,fontWeight:500,marginBottom:2,textAlign:'left' as const}}>
              {t==='stats'?'📊':t==='users'?'👥':t==='leads'?'📋':'💳'} {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
          <div style={{paddingTop:20,marginTop:20,borderTop:'1px solid var(--edge)'}}>
            <button onClick={load} style={{width:'100%',padding:'8px',background:'var(--ink3)',border:'1px solid var(--edge)',borderRadius:6,color:'var(--w3)',fontSize:12,cursor:'pointer'}}>↻ Refresh</button>
          </div>
        </aside>

        <main style={{flex:1,padding:'28px 32px',overflowX:'auto' as const}}>
          {loading && <div style={{textAlign:'center' as const,padding:60,color:'var(--w3)'}}>Loading...</div>}

          {!loading && tab === 'stats' && stats && (
            <div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,marginBottom:24}}>DASHBOARD STATS</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
                {([
                  {l:'Total Users',v:stats.totalUsers,c:'var(--w)'},
                  {l:'Active Paid',v:stats.activePaid,c:'var(--gold)'},
                  {l:'MRR',v:`₹${(stats.mrr||0).toLocaleString('en-IN')}`,c:'var(--green)'},
                  {l:'Total Revenue',v:`₹${(stats.totalRevenue||0).toLocaleString('en-IN')}`,c:'var(--saffron)'},
                  {l:'IG Connected',v:stats.igConnected,c:'var(--blue)'},
                  {l:'Bot Active',v:stats.botActive,c:'var(--green)'},
                  {l:'Total Payments',v:stats.totalPayments,c:'var(--w)'},
                  {l:'Trial Users',v:stats.activeTrial,c:'var(--w3)'},
                ] as {l:string,v:string|number,c:string}[]).map(({l,v,c}) => (
                  <div key={l} style={{background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:12,padding:20}}>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,textTransform:'uppercase' as const,color:'var(--w3)',marginBottom:10}}>{l}</div>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,lineHeight:1,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && tab === 'users' && (
            <div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,marginBottom:24}}>USERS ({users.length})</div>
              <div style={{background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:12,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse' as const}}>
                  <thead><tr>{['Name/Email','Plan','IG','Bot','Actions'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} onMouseEnter={e=>(e.currentTarget.style.background='var(--ink3)')} onMouseLeave={e=>(e.currentTarget.style.background='')}>
                        <td style={td}><div style={{fontWeight:600}}>{u.name||'—'}</div><div style={{fontSize:11,color:'var(--w3)',fontFamily:"'DM Mono',monospace"}}>{u.email}</div></td>
                        <td style={td}><span style={{background:u.plan==='paid'?'rgba(255,215,0,.1)':'var(--ink3)',color:u.plan==='paid'?'var(--gold)':'var(--w3)',fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:4}}>{(u.plan||'FREE').toUpperCase()}</span></td>
                        <td style={td}><span style={{color:u.ig_connected?'var(--green)':'var(--w3)',fontSize:12}}>{u.ig_connected?'✅':'❌'}</span></td>
                        <td style={td}><span style={{color:u.bot_active?'var(--green)':'var(--red)',fontSize:12}}>{u.bot_active?'🟢':'🔴'}</span></td>
                        <td style={td}>
                          <div style={{display:'flex',gap:6}}>
                            <button onClick={()=>grantPro(u.id)} style={{background:'var(--saffron-dim)',color:'var(--saffron)',border:'1px solid rgba(255,107,0,.25)',fontSize:10,padding:'3px 8px',borderRadius:4,cursor:'pointer'}}>Pro</button>
                            <button onClick={()=>toggleBot(u.id)} style={{background:'var(--ink3)',color:'var(--w3)',border:'1px solid var(--edge)',fontSize:10,padding:'3px 8px',borderRadius:4,cursor:'pointer'}}>Bot</button>
                            <button onClick={()=>suspend(u.id)} style={{background:'rgba(255,59,59,.08)',color:'var(--red)',border:'1px solid rgba(255,59,59,.2)',fontSize:10,padding:'3px 8px',borderRadius:4,cursor:'pointer'}}>Ban</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && tab === 'leads' && (
            <div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,marginBottom:24}}>ALL LEADS ({leads.length})</div>
              <div style={{background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:12,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse' as const}}>
                  <thead><tr>{['Name','IG ID','Business','Budget','Status','Time'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {leads.map(l => (
                      <tr key={l.id} onMouseEnter={e=>(e.currentTarget.style.background='var(--ink3)')} onMouseLeave={e=>(e.currentTarget.style.background='')}>
                        <td style={td}><div style={{fontWeight:600}}>{l.name||'—'}</div></td>
                        <td style={{...td,fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--w3)'}}>{l.ig_user_id}</td>
                        <td style={td}>{l.business_type||'—'}</td>
                        <td style={td}>{l.budget||'—'}</td>
                        <td style={td}><span style={{background:l.status==='converted'?'rgba(0,255,136,.08)':'var(--ink3)',color:l.status==='converted'?'var(--green)':'var(--w3)',fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:4}}>{l.status.toUpperCase()}</span></td>
                        <td style={{...td,fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--w3)'}}>{timeAgo(l.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && tab === 'payments' && (
            <div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,marginBottom:24}}>PAYMENTS ({payments.length})</div>
              <div style={{background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:12,overflow:'hidden'}}>
                <table style={{width:'100%',borderCollapse:'collapse' as const}}>
                  <thead><tr>{['User','Amount','Payment ID','Date'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p.id} onMouseEnter={e=>(e.currentTarget.style.background='var(--ink3)')} onMouseLeave={e=>(e.currentTarget.style.background='')}>
                        <td style={td}><div style={{fontWeight:600}}>{p.userName||'—'}</div><div style={{fontSize:11,color:'var(--w3)'}}>{p.userEmail}</div></td>
                        <td style={{...td,color:'var(--green)',fontFamily:"'Bebas Neue',sans-serif",fontSize:20}}>₹{p.amount}</td>
                        <td style={{...td,fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--w3)'}}>{p.razorpay_payment_id}</td>
                        <td style={{...td,fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--w3)'}}>{timeAgo(p.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

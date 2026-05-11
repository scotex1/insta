'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { api, type Lead, type Template } from '@/lib/api';
import { getPlanStatus, timeAgo, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

type Page = 'overview' | 'leads' | 'instagram' | 'template' | 'simulator' | 'billing' | 'settings';

declare global { interface Window { Razorpay: any; } }

export default function DashboardPage() {
  const { firebaseUser, profile, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState<Page>('overview');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState({ total: 0, converted: 0, conversionRate: 0 });
  const [templates, setTemplates] = useState<Template[]>([]);
  const [igStatus, setIgStatus] = useState<{ ig_connected: boolean; ig_page_name: string | null; bot_active: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [simMsg, setSimMsg] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'bot' | 'sys'; text: string }[]>([]);
  const [payLoading, setPayLoading] = useState(false);

  const plan = getPlanStatus(profile);

  // Auth guard
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!firebaseUser) router.push('/login');
    }, 1000);
    return () => clearTimeout(timer);
  }, [firebaseUser, router]);

  const loadData = useCallback(async () => {
    if (!firebaseUser) return;
    setLoading(true);
    try {
      const [leadsRes, statsRes, templatesRes, igRes] = await Promise.allSettled([
        api.leads.list({ limit: 100 }),
        api.leads.stats(),
        api.templates.list(),
        api.instagram.status(),
      ]);
      if (leadsRes.status === 'fulfilled')     setLeads(leadsRes.value.leads);
      if (statsRes.status === 'fulfilled')     setStats(statsRes.value);
      if (templatesRes.status === 'fulfilled') setTemplates(templatesRes.value.templates);
      if (igRes.status === 'fulfilled')        setIgStatus(igRes.value);
    } catch {}
    setLoading(false);
  }, [firebaseUser]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handlePayment = async () => {
    setPayLoading(true);
    try {
      const { orderId, amount } = await api.payment.createOrder();
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'LeadMachine',
        description: 'Pro Plan — 30 Days',
        order_id: orderId,
        handler: async (response: any) => {
          try {
            await api.payment.verify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            toast.success('🎉 Pro activated! Bot now has unlimited power!');
            await refreshProfile();
          } catch { toast.error('Payment verify failed'); }
        },
        theme: { color: '#ff6b00' },
      });
      rzp.open();
    } catch (e: any) {
      toast.error(e.message);
    } finally { setPayLoading(false); }
  };

  const connectInstagram = () => {
    const url = api.instagram.getLoginUrl();
    window.location.href = url + `?uid=${firebaseUser?.uid}`;
  };

  const disconnectInstagram = async () => {
    await api.instagram.disconnect();
    toast.success('Instagram disconnected');
    setIgStatus(s => s ? { ...s, ig_connected: false, ig_page_name: null } : null);
  };

  const filteredLeads = leads.filter(l =>
    !search || (l.name?.toLowerCase().includes(search.toLowerCase()) || l.ig_user_id.includes(search))
  );

  const todayLeads = leads.filter(l => {
    if (!l.created_at?._seconds) return false;
    const d = new Date(l.created_at._seconds * 1000);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const handleSimSend = () => {
    if (!simMsg.trim()) return;
    const msg = simMsg.trim();
    setSimMsg('');
    setChat(c => [...c, { role: 'user', text: msg }]);
    setTimeout(() => {
      const triggers = ['hi','hello','price','details','start','info','interested','help'];
      const isTriggered = triggers.some(t => msg.toLowerCase().includes(t));
      if (chat.length === 0 && !isTriggered) {
        setChat(c => [...c, { role: 'sys', text: '⚡ Trigger word nahi mila. "hi" ya "interested" try karo।' }]);
        return;
      }
      const responses = [
        'Hey 👋 Kaise ho! Aapka naam kya hai?',
        'Nice to meet you! 😊\nBusiness kya hai?\n1️⃣ Service  2️⃣ Product  3️⃣ Freelance  4️⃣ Other',
        'Aap exactly kya sell karte ho?',
        'Perfect! 🎯\nBudget approx?\n💰 Under ₹5K\n💰 ₹5–15K\n💰 ₹15K+',
        '🔥 Excellent! Details yahan dekho 👇\nhttps://yourwebsite.com',
        'Interested? Reply karo: YES 👍\nTeam 24hrs me contact karegi! 🚀',
        '🎉 Shukriya! Hamari team jald contact karegi। 🙏',
      ];
      const idx = Math.floor(chat.length / 2);
      setChat(c => [...c, { role: 'bot', text: responses[Math.min(idx, responses.length-1)] }]);
    }, 700);
  };

  const exportCSV = () => {
    const rows = [['Name','IG ID','Business','Product','Budget','Status','Date']];
    filteredLeads.forEach(l => rows.push([l.name||'—',l.ig_user_id,l.business_type||'—',l.product||'—',l.budget||'—',l.status,formatDate(l.created_at)]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'leads.csv';
    a.click();
  };

  const nav = (p: Page) => setPage(p);

  const S = {
    sidebar: { width:210,flexShrink:0,borderRight:'1px solid var(--edge)',padding:'20px 10px',position:'sticky' as const,top:60,height:'calc(100vh - 60px)',overflowY:'auto' as const,background:'var(--ink)' },
    sbLabel: { fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2.5,textTransform:'uppercase' as const,color:'var(--w3)',padding:'0 10px',margin:'14px 0 6px',display:'block' },
  };

  if (!firebaseUser) return (
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center' }}>
      <div style={{ width:32,height:32,borderRadius:'50%',border:'3px solid var(--edge2)',borderTopColor:'var(--saffron)',animation:'spin .65s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      {/* Load Razorpay */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      {/* Navbar */}
      <nav style={{ position:'sticky',top:0,zIndex:300,borderBottom:'1px solid var(--edge)',background:'rgba(8,8,16,0.9)',backdropFilter:'blur(20px)',height:60,display:'flex',alignItems:'center' }}>
        <div style={{ maxWidth:'100%',width:'100%',padding:'0 32px',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2 }}>
            <span style={{ color:'var(--saffron)' }}>L</span>EAD<span style={{ color:'var(--saffron)' }}>M</span>ACHINE
          </span>
          <div style={{ display:'flex',alignItems:'center',gap:8 }}>
            <span className={igStatus?.bot_active && igStatus?.ig_connected ? 'dot-live' : 'dot-off'} />
            <span style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--w3)' }}>
              {igStatus?.ig_connected ? `@${igStatus.ig_page_name || 'connected'}` : 'IG not connected'}
            </span>
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <span style={{ fontSize:13,color:'var(--w2)' }}>{profile?.name || firebaseUser.email}</span>
            {plan.isPaid ? <span style={{ background:'rgba(255,215,0,.1)',color:'var(--gold)',border:'1px solid rgba(255,215,0,.2)',fontSize:10,fontWeight:700,letterSpacing:1,padding:'2px 8px',borderRadius:4 }}>PRO</span>
              : <span style={{ background:'var(--ink3)',color:'var(--w3)',border:'1px solid var(--edge)',fontSize:10,fontWeight:700,letterSpacing:1,padding:'2px 8px',borderRadius:4 }}>FREE</span>}
            <button onClick={handleLogout} style={{ background:'none',border:'none',color:'var(--w3)',fontSize:13,cursor:'pointer',padding:'6px 10px' }}>Logout</button>
          </div>
        </div>
      </nav>

      <div style={{ display:'flex',flex:1,minHeight:'calc(100vh - 60px)',position:'relative',zIndex:1 }}>
        {/* Sidebar */}
        <aside style={S.sidebar}>
          <span style={S.sbLabel}>Main</span>
          {([['overview','📊','Overview'],['leads','👥','Leads']] as const).map(([id,icon,label])=>(
            <button key={id} onClick={()=>nav(id)} style={{ display:'flex',alignItems:'center',gap:10,width:'100%',padding:'8px 10px',borderRadius:6,background:page===id?'var(--saffron-dim)':'none',border:'none',cursor:'pointer',color:page===id?'var(--saffron)':'var(--w2)',fontSize:13,fontWeight:500,marginBottom:1,textAlign:'left' }}>
              <span>{icon}</span>{label}
              {id==='leads' && <span style={{ marginLeft:'auto',background:'var(--ink3)',color:'var(--w3)',fontFamily:"'DM Mono',monospace",fontSize:10,padding:'2px 7px',borderRadius:10 }}>{leads.length}</span>}
            </button>
          ))}
          <span style={S.sbLabel}>Setup</span>
          {([['instagram','📱','Instagram'],['template','💬','Template'],['simulator','🎮','Simulator']] as const).map(([id,icon,label])=>(
            <button key={id} onClick={()=>nav(id)} style={{ display:'flex',alignItems:'center',gap:10,width:'100%',padding:'8px 10px',borderRadius:6,background:page===id?'var(--saffron-dim)':'none',border:'none',cursor:'pointer',color:page===id?'var(--saffron)':'var(--w2)',fontSize:13,fontWeight:500,marginBottom:1,textAlign:'left' }}>
              <span>{icon}</span>{label}
            </button>
          ))}
          <span style={S.sbLabel}>Account</span>
          {([['billing','💳','Billing'],['settings','⚙️','Settings']] as const).map(([id,icon,label])=>(
            <button key={id} onClick={()=>nav(id)} style={{ display:'flex',alignItems:'center',gap:10,width:'100%',padding:'8px 10px',borderRadius:6,background:page===id?'var(--saffron-dim)':'none',border:'none',cursor:'pointer',color:page===id?'var(--saffron)':'var(--w2)',fontSize:13,fontWeight:500,marginBottom:1,textAlign:'left' }}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main style={{ flex:1,padding:'28px 32px',overflowX:'hidden',minWidth:0 }}>

          {/* OVERVIEW */}
          {page === 'overview' && (
            <div className="fade">
              <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12 }}>
                <div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:-.5,lineHeight:1 }}>OVERVIEW</div>
                  <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--w3)',marginTop:4 }}>{new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
                </div>
                <button onClick={()=>nav('simulator')} style={{ background:'var(--saffron)',color:'#000',fontWeight:700,fontSize:12,padding:'6px 14px',borderRadius:6,border:'none',cursor:'pointer' }}>🎮 Test Bot</button>
              </div>

              {/* Trial/plan banner */}
              {!plan.isPaid && (
                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',background:'linear-gradient(135deg,#1a0800,#0f0800)',border:'1px solid rgba(255,107,0,.3)',borderRadius:12,padding:'14px 20px',marginBottom:20,flexWrap:'wrap',gap:12 }}>
                  <div>
                    <span style={{ fontSize:14,fontWeight:600 }}>
                      {plan.expired ? '❌ Trial Expire Ho Gayi' : <>⏳ Trial: <span style={{ color:'var(--saffron)',fontFamily:"'Bebas Neue',sans-serif",fontSize:20 }}>{plan.daysLeft}</span> din baaki</>}
                    </span>
                    <div style={{ fontSize:12,color:'var(--w3)',marginTop:2 }}>{plan.expired ? 'Pro upgrade karo bot continue karne ke liye' : 'Pro upgrade karo unlimited power ke liye'}</div>
                  </div>
                  <button onClick={()=>nav('billing')} style={{ background:'var(--saffron)',color:'#000',fontWeight:700,fontSize:12,padding:'8px 18px',borderRadius:6,border:'none',cursor:'pointer' }}>
                    ₹499/month UPGRADE →
                  </button>
                </div>
              )}

              {/* Stats */}
              <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:24 }}>
                {[
                  { label:'Total Leads',val:stats.total,color:'var(--saffron)',sub:'All time' },
                  { label:'Converted',val:stats.converted,color:'var(--green)',sub:'Said YES' },
                  { label:'Today',val:todayLeads,color:'var(--w)',sub:'New today' },
                  { label:'Conv. Rate',val:`${stats.conversionRate}%`,color:'var(--w)',sub:'Lead → YES' },
                ].map(({label,val,color,sub})=>(
                  <div key={label} style={{ background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:12,padding:20 }}>
                    <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--w3)',marginBottom:10 }}>{label}</div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:40,letterSpacing:-2,lineHeight:1,color }}>{val}</div>
                    <div style={{ fontSize:11,color:'var(--w3)',marginTop:5 }}>{sub}</div>
                  </div>
                ))}
              </div>

              {/* Recent leads */}
              <div style={{ background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:12,overflow:'hidden' }}>
                <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:'1px solid var(--edge)' }}>
                  <div style={{ fontSize:13,fontWeight:700 }}>Recent Leads</div>
                  <button onClick={()=>nav('leads')} style={{ background:'transparent',color:'var(--w3)',border:'1px solid var(--edge2)',fontSize:12,padding:'5px 12px',borderRadius:6,cursor:'pointer' }}>View All →</button>
                </div>
                {loading ? <div style={{ padding:32,textAlign:'center',color:'var(--w3)' }}>Loading...</div>
                : leads.length === 0 ? <div style={{ textAlign:'center',padding:48,color:'var(--w3)' }}><div style={{ fontSize:32,marginBottom:8 }}>📭</div>Abhi koi leads nahi। Instagram connect karo aur bot shuru karo।</div>
                : leads.slice(0,5).map(l=>(
                  <div key={l.id} style={{ display:'grid',gridTemplateColumns:'32px 1.5fr 1fr 1fr 90px',gap:0,alignItems:'center',padding:'11px 20px',borderBottom:'1px solid var(--edge)' }}>
                    <div style={{ width:28,height:28,borderRadius:'50%',background:'var(--saffron)',color:'#000',fontWeight:700,fontSize:11,display:'grid',placeItems:'center' }}>{(l.name||'?')[0].toUpperCase()}</div>
                    <div><div style={{ fontWeight:600,fontSize:13 }}>{l.name||'—'}</div><div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--w3)' }}>{l.ig_user_id.slice(0,16)}...</div></div>
                    <div style={{ fontSize:12,color:'var(--w2)' }}>{l.business_type||'—'}</div>
                    <div style={{ fontSize:12,color:'var(--w2)' }}>{l.budget||'—'}</div>
                    <span style={{ display:'inline-flex',alignItems:'center',padding:'3px 9px',borderRadius:4,fontSize:10,fontWeight:700,letterSpacing:1,background:l.status==='converted'?'rgba(0,255,136,.08)':'var(--ink3)',color:l.status==='converted'?'var(--green)':'var(--w3)',border:`1px solid ${l.status==='converted'?'rgba(0,255,136,.2)':'var(--edge)'}` }}>
                      {l.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEADS */}
          {page === 'leads' && (
            <div className="fade">
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12 }}>
                <div><div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:32 }}>ALL LEADS</div><div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--w3)' }}>Saare captured leads</div></div>
                <div style={{ display:'flex',gap:10 }}>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search..." style={{ background:'var(--ink3)',border:'1px solid var(--edge)',borderRadius:6,padding:'7px 14px',color:'var(--w)',fontSize:13,outline:'none',width:200 }} />
                  <button onClick={exportCSV} style={{ background:'transparent',color:'var(--w3)',border:'1px solid var(--edge2)',fontSize:12,padding:'7px 14px',borderRadius:6,cursor:'pointer' }}>↓ CSV</button>
                </div>
              </div>
              <div style={{ background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:12,overflow:'hidden' }}>
                <div style={{ display:'grid',gridTemplateColumns:'32px 1.5fr 1fr 1fr 90px 90px',padding:'11px 20px',background:'rgba(255,255,255,.02)',borderBottom:'1px solid var(--edge)' }}>
                  {['','Name / IG','Business','Budget','Status','Time'].map(h=><div key={h} style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--w3)' }}>{h}</div>)}
                </div>
                {filteredLeads.length === 0 ? <div style={{ textAlign:'center',padding:48,color:'var(--w3)' }}>Koi leads nahi mili</div>
                : filteredLeads.map(l=>(
                  <div key={l.id} style={{ display:'grid',gridTemplateColumns:'32px 1.5fr 1fr 1fr 90px 90px',alignItems:'center',padding:'11px 20px',borderBottom:'1px solid var(--edge)',transition:'background .12s' }}
                    onMouseEnter={e=>(e.currentTarget.style.background='var(--ink3)')}
                    onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                    <div style={{ width:28,height:28,borderRadius:'50%',background:'var(--saffron)',color:'#000',fontWeight:700,fontSize:11,display:'grid',placeItems:'center' }}>{(l.name||'?')[0].toUpperCase()}</div>
                    <div><div style={{ fontWeight:600,fontSize:13 }}>{l.name||'—'}</div><div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--w3)' }}>{l.ig_user_id}</div></div>
                    <div style={{ fontSize:12,color:'var(--w2)' }}>{l.business_type||'—'}</div>
                    <div style={{ fontSize:12,color:'var(--w2)' }}>{l.budget||'—'}</div>
                    <span style={{ display:'inline-flex',padding:'3px 9px',borderRadius:4,fontSize:10,fontWeight:700,letterSpacing:1,background:l.status==='converted'?'rgba(0,255,136,.08)':'var(--ink3)',color:l.status==='converted'?'var(--green)':'var(--w3)',border:`1px solid ${l.status==='converted'?'rgba(0,255,136,.2)':'var(--edge)'}` }}>
                      {l.status.toUpperCase()}
                    </span>
                    <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--w3)' }}>{timeAgo(l.created_at)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INSTAGRAM */}
          {page === 'instagram' && (
            <div className="fade">
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24 }}>
                <div><div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:32 }}>INSTAGRAM</div><div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--w3)' }}>Connect via Meta OAuth</div></div>
              </div>
              <div style={{ background:'var(--ink2)',border:`1px solid ${igStatus?.ig_connected?'rgba(0,255,136,.25)':'var(--edge)'}`,borderRadius:12,padding:28 }}>
                <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:20 }}>
                  <div style={{ width:50,height:50,borderRadius:14,background:'linear-gradient(45deg,#833ab4,#fd1d1d,#fcb045)',display:'grid',placeItems:'center',fontSize:24 }}>📷</div>
                  <div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:22 }}>{igStatus?.ig_connected ? 'Instagram Connected ✅' : 'Connect Instagram'}</div>
                    <div style={{ fontSize:13,color:'var(--w2)' }}>{igStatus?.ig_connected ? `Page: ${igStatus.ig_page_name}` : 'Apna Instagram Business account connect karo'}</div>
                  </div>
                </div>

                {igStatus?.ig_connected ? (
                  <div>
                    <div style={{ background:'rgba(0,255,136,.06)',border:'1px solid rgba(0,255,136,.2)',borderRadius:8,padding:'12px 16px',fontSize:13,color:'var(--green)',marginBottom:16 }}>
                      ✅ Instagram connected! Bot active hai। Leads aayenge!
                    </div>
                    <button onClick={disconnectInstagram} style={{ background:'rgba(255,59,59,.1)',color:'var(--red)',border:'1px solid rgba(255,59,59,.2)',fontSize:12,padding:'6px 14px',borderRadius:6,cursor:'pointer' }}>
                      Disconnect Instagram
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:20 }}>
                      {[['1','Meta App Banao','developers.facebook.com → New App → Instagram add karo'],['2','OAuth Login Karo','Neeche button click karo aur Facebook se login karo'],['3','Webhook Set Karo','Meta dashboard mein neeche diya URL paste karo']].map(([n,t,s])=>(
                        <div key={n} style={{ background:'var(--ink3)',border:'1px solid var(--edge)',borderRadius:12,padding:16 }}>
                          <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:'var(--saffron)',lineHeight:1,marginBottom:8 }}>{n}</div>
                          <div style={{ fontWeight:700,fontSize:13,marginBottom:4 }}>{t}</div>
                          <div style={{ fontSize:12,color:'var(--w2)',lineHeight:1.5 }}>{s}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background:'var(--saffron-dim)',border:'1px solid rgba(255,107,0,.2)',borderRadius:8,padding:'12px 16px',fontSize:13,color:'var(--saffron2)',marginBottom:16 }}>
                      ⚡ OAuth flow use karo — yeh automatically Page Access Token generate karta hai jo DM automation ke liye zaroori hai।
                    </div>
                    <button onClick={connectInstagram} style={{ display:'inline-flex',alignItems:'center',gap:8,background:'var(--saffron)',color:'#000',fontWeight:700,fontSize:14,padding:'12px 24px',borderRadius:8,border:'none',cursor:'pointer' }}>
                      📷 Instagram se Connect Karo (OAuth)
                    </button>
                  </div>
                )}

                <div style={{ marginTop:20,paddingTop:20,borderTop:'1px solid var(--edge)' }}>
                  <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--w3)',marginBottom:10 }}>Webhook Callback URL (Meta Dashboard mein paste karo)</div>
                  <div onClick={()=>{navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BACKEND_URL}/webhook/instagram`);toast.success('Copied!');}}
                    style={{ background:'var(--ink3)',border:'1px solid var(--edge)',borderRadius:6,padding:'11px 14px',fontFamily:"'DM Mono',monospace",fontSize:12,color:'var(--saffron)',cursor:'pointer',wordBreak:'break-all' }}>
                    {process.env.NEXT_PUBLIC_BACKEND_URL}/webhook/instagram
                  </div>
                  <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--w3)',marginBottom:10,marginTop:12 }}>Verify Token</div>
                  <div onClick={()=>{navigator.clipboard.writeText('leadmachine_verify_2025');toast.success('Copied!');}}
                    style={{ background:'var(--ink3)',border:'1px solid var(--edge)',borderRadius:6,padding:'11px 14px',fontFamily:"'DM Mono',monospace",fontSize:12,color:'var(--saffron)',cursor:'pointer' }}>
                    leadmachine_verify_2025
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE */}
          {page === 'template' && (
            <div className="fade">
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24,flexWrap:'wrap',gap:12 }}>
                <div><div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:32 }}>DM TEMPLATE</div><div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--w3)' }}>{plan.isPaid ? 'Paid: 5 templates' : 'Free: 1 template'}</div></div>
                <span style={{ background:'rgba(0,255,136,.08)',color:'var(--green)',border:'1px solid rgba(0,255,136,.2)',fontSize:10,fontWeight:700,letterSpacing:1,padding:'3px 9px',borderRadius:4 }}>ACTIVE</span>
              </div>
              <div style={{ background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:12,overflow:'hidden',marginBottom:16 }}>
                <div style={{ padding:'16px 20px',borderBottom:'1px solid var(--edge)',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                  <div style={{ fontSize:13,fontWeight:700 }}>Default Lead Funnel (6 Steps)</div>
                  <span style={{ background:'rgba(0,255,136,.08)',color:'var(--green)',border:'1px solid rgba(0,255,136,.2)',fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:4 }}>DEFAULT</span>
                </div>
                <div style={{ padding:20 }}>
                  {[
                    { step:1, hi:'Hey 👋 Kaise ho! Aapka naam kya hai?', en:"Hey 👋 What's your name?", save:'name' },
                    { step:2, hi:'Nice to meet you {name}! 😊\nBusiness kya hai?\n1️⃣ Service  2️⃣ Product  3️⃣ Freelance  4️⃣ Other', en:'Nice {name}! 😊\n1️⃣ Service  2️⃣ Product  3️⃣ Freelance  4️⃣ Other', save:'business_type' },
                    { step:3, hi:'Aap exactly kya sell karte ho?', en:'What exactly do you sell?', save:'product' },
                    { step:4, hi:'Perfect! 🎯\nBudget approx?\n💰 Under ₹5K\n💰 ₹5–15K\n💰 ₹15K+', en:'Perfect! 🎯\nApprox budget?\n💰 Under ₹5K\n💰 ₹5–15K\n💰 ₹15K+', save:'budget' },
                    { step:5, hi:'🔥 Excellent! Details yahan dekho 👇\n{website_link}', en:'🔥 Check here 👇\n{website_link}', save:null },
                    { step:6, hi:'Interested? Reply karo: YES 👍\nTeam 24hrs me contact karegi! 🚀', en:'Reply YES if interested 👍\nWe\'ll contact in 24hrs! 🚀', save:'interest' },
                  ].map(s=>(
                    <div key={s.step} style={{ display:'flex',gap:12,marginBottom:12,padding:12,background:'var(--ink3)',borderRadius:8 }}>
                      <div style={{ width:28,height:28,borderRadius:'50%',background:'var(--saffron)',color:'#000',fontWeight:700,fontSize:12,display:'grid',placeItems:'center',flexShrink:0 }}>{s.step}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12,color:'var(--w)',whiteSpace:'pre-line',marginBottom:4 }}>{s.hi}</div>
                        <div style={{ fontSize:11,color:'var(--w3)',fontFamily:"'DM Mono',monospace" }}>saves: {s.save||'nothing'}</div>
                      </div>
                    </div>
                  ))}
                  {!plan.isPaid && (
                    <div style={{ marginTop:16,padding:'12px 16px',background:'var(--saffron-dim)',border:'1px solid rgba(255,107,0,.2)',borderRadius:8,fontSize:13,color:'var(--saffron2)' }}>
                      ⚡ Pro upgrade karo custom templates banane ke liye। <button onClick={()=>nav('billing')} style={{ background:'none',border:'none',color:'var(--saffron)',cursor:'pointer',fontWeight:700,fontSize:13 }}>Upgrade →</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SIMULATOR */}
          {page === 'simulator' && (
            <div className="fade">
              <div style={{ marginBottom:24 }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:32 }}>BOT SIMULATOR</div>
                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--w3)' }}>Test karo bot kaise respond karta hai</div>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 300px',gap:20,alignItems:'start' }}>
                <div style={{ background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:12,overflow:'hidden' }}>
                  <div style={{ padding:'14px 20px',borderBottom:'1px solid var(--edge)',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                    <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                      <div style={{ width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#833ab4,#fcb045)',display:'grid',placeItems:'center',fontSize:16 }}>😊</div>
                      <div><div style={{ fontWeight:700,fontSize:13 }}>Test User</div><div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--w3)' }}>@test_lead_123</div></div>
                    </div>
                    <button onClick={()=>setChat([])} style={{ background:'none',border:'1px solid var(--edge)',color:'var(--w3)',fontSize:11,padding:'4px 10px',borderRadius:4,cursor:'pointer' }}>Reset</button>
                  </div>
                  <div style={{ height:320,overflowY:'auto',padding:16,display:'flex',flexDirection:'column',gap:8 }}>
                    {chat.length === 0 && <div style={{ alignSelf:'center',color:'var(--w3)',fontSize:12,fontFamily:"'DM Mono',monospace",textAlign:'center',marginTop:60 }}>👆 "hi" type karo aur bot se baat karo</div>}
                    {chat.map((m,i)=>(
                      <div key={i} style={{ maxWidth:'76%',padding:'9px 13px',fontSize:13,lineHeight:1.5,whiteSpace:'pre-line',alignSelf:m.role==='user'?'flex-end':m.role==='sys'?'center':'flex-start',background:m.role==='user'?'var(--saffron)':m.role==='sys'?'rgba(0,255,136,.05)':'var(--ink3)',color:m.role==='user'?'#000':m.role==='sys'?'var(--green)':'var(--w)',border:m.role==='sys'?'1px dashed rgba(0,255,136,.2)':m.role==='bot'?'1px solid var(--edge)':'none',borderRadius:m.role==='user'?'12px 12px 3px 12px':'12px 12px 12px 3px',fontFamily:m.role==='sys'?"'DM Mono',monospace":undefined,fontWeight:m.role==='user'?500:undefined }}>
                        {m.text}
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'flex',gap:8,padding:'12px 16px',borderTop:'1px solid var(--edge)' }}>
                    <input value={simMsg} onChange={e=>setSimMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSimSend()} placeholder='Type "hi" ya koi trigger word...'
                      style={{ flex:1,background:'var(--ink3)',border:'1px solid var(--edge)',borderRadius:6,padding:'9px 13px',color:'var(--w)',fontSize:13,outline:'none' }} />
                    <button onClick={handleSimSend} style={{ background:'var(--saffron)',border:'none',borderRadius:6,padding:'9px 16px',color:'#000',fontWeight:700,fontSize:13,cursor:'pointer' }}>Send</button>
                  </div>
                </div>
                <div>
                  <div style={{ background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:12,padding:16,marginBottom:12 }}>
                    <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--w3)',marginBottom:10 }}>Trigger Words</div>
                    <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
                      {['hi','hello','price','details','start','info','interested','help','join'].map(t=>(
                        <button key={t} onClick={()=>setSimMsg(t)} style={{ background:'var(--ink3)',border:'1px solid var(--edge)',color:'var(--saffron)',fontSize:11,fontFamily:"'DM Mono',monospace",padding:'3px 10px',borderRadius:4,cursor:'pointer' }}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:12,padding:16 }}>
                    <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--w3)',marginBottom:10 }}>Session Info</div>
                    {[['Messages',chat.length],['Bot replies',chat.filter(m=>m.role==='bot').length],['Flow step',Math.floor(chat.filter(m=>m.role==='user').length)]].map(([k,v])=>(
                      <div key={String(k)} style={{ display:'flex',justifyContent:'space-between',fontSize:12,padding:'5px 0',borderBottom:'1px solid var(--edge)' }}>
                        <span style={{ color:'var(--w3)' }}>{k}</span>
                        <span style={{ color:'var(--saffron)',fontFamily:"'DM Mono',monospace" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BILLING */}
          {page === 'billing' && (
            <div className="fade">
              <div style={{ marginBottom:24 }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:32 }}>BILLING</div>
                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--w3)' }}>Plan aur payment manage karo</div>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:20 }}>
                {/* Current plan */}
                <div style={{ background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:12,padding:24 }}>
                  <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--w3)',marginBottom:8 }}>Current Plan</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:40,lineHeight:1,marginBottom:4,color:plan.isPaid?'var(--gold)':'var(--w)' }}>{plan.isPaid?'PRO':'FREE TRIAL'}</div>
                  <div style={{ fontSize:13,color:'var(--w2)',marginBottom:16 }}>{plan.isPaid?`Expires in ${plan.daysLeft} days`:plan.expired?'Trial expired':'Trial active'}</div>
                  {plan.isPaid && <div style={{ background:'rgba(0,255,136,.06)',border:'1px solid rgba(0,255,136,.2)',borderRadius:8,padding:'10px 14px',fontSize:13,color:'var(--green)' }}>✅ Pro features active hai</div>}
                </div>

                {/* Upgrade card */}
                {!plan.isPaid && (
                  <div style={{ background:'linear-gradient(135deg,var(--ink2),#1a0a00)',border:'1px solid var(--saffron)',borderRadius:12,padding:24,position:'relative',overflow:'hidden' }}>
                    <div style={{ position:'absolute',top:16,right:-28,background:'var(--saffron)',color:'#000',fontFamily:"'DM Mono',monospace",fontSize:9,fontWeight:500,letterSpacing:2,padding:'4px 36px',transform:'rotate(35deg)' }}>BEST VALUE</div>
                    <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:2,textTransform:'uppercase',color:'var(--saffron)',marginBottom:12 }}>Pro Plan</div>
                    <div style={{ display:'flex',alignItems:'flex-end',gap:6,marginBottom:6 }}>
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:64,lineHeight:1,color:'var(--saffron)' }}>₹499</div>
                      <div style={{ fontSize:14,color:'var(--w3)',paddingBottom:10 }}>/month</div>
                    </div>
                    <ul style={{ listStyle:'none',marginBottom:24 }}>
                      {['Unlimited Instagram DMs','5 Custom Templates','Advanced Lead Analytics','Priority Support','No Branding'].map(f=>(
                        <li key={f} style={{ display:'flex',alignItems:'center',gap:8,fontSize:14,padding:'8px 0',borderBottom:'1px solid var(--edge)' }}>
                          <span style={{ color:'var(--green)',flexShrink:0 }}>✓</span>
                          <span style={{ color:'var(--w2)' }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button onClick={handlePayment} disabled={payLoading} style={{ width:'100%',background:'var(--saffron)',color:'#000',fontWeight:700,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1,fontSize:16,padding:'14px',borderRadius:8,border:'none',cursor:payLoading?'not-allowed':'pointer',opacity:payLoading?.7:1 }}>
                      {payLoading ? 'Loading...' : '💳 UPGRADE TO PRO →'}
                    </button>
                    <p style={{ fontSize:11,color:'var(--w3)',textAlign:'center',marginTop:10 }}>UPI · Cards · Netbanking · Cancel anytime</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {page === 'settings' && (
            <div className="fade">
              <div style={{ marginBottom:24 }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:32 }}>SETTINGS</div>
                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--w3)' }}>Account settings</div>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:20 }}>
                <div style={{ background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:12,padding:24 }}>
                  <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--w3)',marginBottom:16 }}>Account Info</div>
                  {[['Name',profile?.name||'—'],['Email',firebaseUser.email||'—'],['Plan',plan.isPaid?'Pro':'Free Trial'],['Days Left',plan.expired?'Expired':`${plan.daysLeft} days`]].map(([k,v])=>(
                    <div key={String(k)} style={{ display:'flex',justifyContent:'space-between',fontSize:13,padding:'10px 0',borderBottom:'1px solid var(--edge)' }}>
                      <span style={{ color:'var(--w3)' }}>{k}</span>
                      <span style={{ color:'var(--w)',fontFamily:"'DM Mono',monospace" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:12,padding:24 }}>
                  <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--w3)',marginBottom:16 }}>Bot Config</div>
                  {[['IG Connected',igStatus?.ig_connected?'Yes ✅':'No ❌'],['Bot Active',igStatus?.bot_active?'Active 🟢':'Inactive 🔴'],['Page',igStatus?.ig_page_name||'—']].map(([k,v])=>(
                    <div key={String(k)} style={{ display:'flex',justifyContent:'space-between',fontSize:13,padding:'10px 0',borderBottom:'1px solid var(--edge)' }}>
                      <span style={{ color:'var(--w3)' }}>{k}</span>
                      <span style={{ color:'var(--w)' }}>{v}</span>
                    </div>
                  ))}
                  <button onClick={handleLogout} style={{ marginTop:20,width:'100%',background:'rgba(255,59,59,.08)',color:'var(--red)',border:'1px solid rgba(255,59,59,.2)',fontSize:13,fontWeight:700,padding:'10px',borderRadius:8,cursor:'pointer' }}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .fade{animation:fadeIn .2s ease}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:1000px){aside{display:none}}
        @media(max-width:600px){main{padding:16px}}
      `}</style>
    </>
  );
}

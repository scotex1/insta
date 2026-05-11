'use client';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <section style={{ padding: '90px 0 80px', textAlign: 'center' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
            <div className="rise d1" style={{ fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'var(--saffron)',marginBottom:18,display:'flex',alignItems:'center',justifyContent:'center',gap:10 }}>
              <span style={{ width:24,height:1,background:'var(--saffron)',display:'inline-block' }}/>
              Instagram Graph API · Razorpay · Firebase · India 🇮🇳
              <span style={{ width:24,height:1,background:'var(--saffron)',display:'inline-block' }}/>
            </div>
            <h1 className="rise d2" style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(60px,9vw,120px)',lineHeight:.9,letterSpacing:-1,marginBottom:24 }}>
              <span style={{ WebkitTextStroke:'1.5px rgba(240,240,248,0.3)',color:'transparent' }}>INSTAGRAM</span><br/>
              <span style={{ color:'var(--saffron)' }}>LEADS</span><br/>AUTOPILOT
            </h1>
            <p className="rise d3" style={{ fontSize:17,color:'var(--w2)',maxWidth:500,margin:'0 auto 40px',lineHeight:1.7 }}>
              User DM kare — bot automatically qualify kare, link bheje, lead capture kare। 7 din free mein try karo।
            </p>
            <div className="rise d4" style={{ display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap' }}>
              <Link href="/signup" style={{ display:'inline-flex',alignItems:'center',background:'var(--saffron)',color:'#000',fontWeight:700,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1.5,fontSize:16,padding:'15px 36px',borderRadius:6,textDecoration:'none' }}>
                🚀 FREE TRIAL SHURU KARO
              </Link>
              <Link href="/pricing" style={{ display:'inline-flex',alignItems:'center',background:'transparent',color:'var(--w)',border:'1px solid var(--edge2)',fontWeight:700,fontSize:15,padding:'13px 28px',borderRadius:6,textDecoration:'none' }}>
                Pricing Dekho →
              </Link>
            </div>
            <p className="rise d5" style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--w3)',marginTop:16 }}>
              ✓ 7 din free · ✓ Card nahi chahiye · ✓ Cancel anytime · ✓ Meta compliant
            </p>
            <div className="rise d6" style={{ display:'flex',gap:48,justifyContent:'center',marginTop:64,paddingTop:40,borderTop:'1px solid var(--edge)',flexWrap:'wrap' }}>
              {[['₹0','Setup Cost'],['7','Day Free Trial'],['6','Step Auto Flow'],['24/7','Bot Active']].map(([n,l])=>(
                <div key={l}>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:44,color:'var(--saffron)',lineHeight:1 }}>{n}</div>
                  <div style={{ fontFamily:"'DM Mono',monospace",fontSize:12,color:'var(--w3)',letterSpacing:1 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how" style={{ padding:'80px 0' }}>
          <div style={{ maxWidth:1200,margin:'0 auto',padding:'0 32px' }}>
            <span style={{ fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:3,textTransform:'uppercase',color:'var(--saffron)',display:'block',marginBottom:12 }}>Process</span>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(36px,5vw,64px)',lineHeight:.95,marginBottom:16 }}>5 STEPS MEIN<br/>LEAD READY</h2>
            <p style={{ fontSize:16,color:'var(--w2)',maxWidth:480,lineHeight:1.7,marginBottom:56 }}>User "hi" bheje aur system automatically sab handle kare।</p>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(5,1fr)',position:'relative' }}>
              <div style={{ position:'absolute',top:35,left:'10%',right:'10%',height:1,background:'linear-gradient(90deg,transparent,var(--saffron) 30%,var(--saffron) 70%,transparent)' }}/>
              {[['💬','DM Aata Hai','User message karta hai'],['🎯','Trigger Match','Keyword detect hota hai'],['🤖','Bot Q&A','6 questions automatically'],['🔗','Link Bheja','Website auto-send'],['✅','Lead Captured','Dashboard mein save']].map(([icon,t,s],i)=>(
                <div key={i} className={`rise d${i+1}`} style={{ textAlign:'center',padding:'0 12px',position:'relative',zIndex:1 }}>
                  <div style={{ width:70,height:70,borderRadius:14,margin:'0 auto 16px',background:'var(--ink2)',border:'1px solid var(--edge)',display:'grid',placeItems:'center',fontSize:26,position:'relative' }}>
                    <span style={{ position:'absolute',top:-8,right:-8,width:20,height:20,borderRadius:'50%',background:'var(--saffron)',color:'#000',fontFamily:"'DM Mono',monospace",fontSize:10,display:'grid',placeItems:'center' }}>{i+1}</span>
                    {icon}
                  </div>
                  <div style={{ fontSize:13,fontWeight:700,marginBottom:4 }}>{t}</div>
                  <div style={{ fontSize:12,color:'var(--w3)' }}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding:'0 0 80px' }}>
          <div style={{ maxWidth:1200,margin:'0 auto',padding:'0 32px' }}>
            <span style={{ fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:3,textTransform:'uppercase',color:'var(--saffron)',display:'block',marginBottom:12 }}>Features</span>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(36px,5vw,64px)',lineHeight:.95,marginBottom:56 }}>SABKUCH EK JAGAH</h2>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,background:'var(--edge)',border:'1px solid var(--edge)',borderRadius:12,overflow:'hidden' }}>
              {[['📱','Instagram Graph API','Direct Meta Webhook। No third-party। Fully policy compliant।'],['🌐','Hinglish + English','User ki language auto-detect। Smart replies।'],['💳','Razorpay Payment','UPI, cards, netbanking। ₹499/month। Cancel anytime।'],['👥','Multi-User SaaS','Har user ka alag account, alag Instagram, alag leads।'],['📊','Lead Dashboard','Real-time stats, lead management, conversion tracking।'],['👑','Admin Panel','Users manage karo, revenue dekho, bots control karo।']].map(([icon,t,d])=>(
                <div key={t} style={{ background:'var(--ink)',padding:28,transition:'background .2s',cursor:'default' }}
                  onMouseEnter={e=>(e.currentTarget.style.background='var(--ink2)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='var(--ink)')}>
                  <div style={{ fontSize:28,marginBottom:14 }}>{icon}</div>
                  <div style={{ fontSize:15,fontWeight:700,marginBottom:7 }}>{t}</div>
                  <div style={{ fontSize:13,color:'var(--w2)',lineHeight:1.6 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div style={{ padding:'0 32px 80px' }}>
          <div style={{ maxWidth:1200,margin:'0 auto' }}>
            <div className="rise" style={{ background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:20,padding:'72px 40px',textAlign:'center',position:'relative',overflow:'hidden' }}>
              <div style={{ position:'absolute',width:500,height:500,borderRadius:'50%',top:-200,left:'50%',transform:'translateX(-50%)',background:'radial-gradient(circle,rgba(255,107,0,.06),transparent 70%)',pointerEvents:'none' }}/>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(40px,6vw,80px)',lineHeight:.95,marginBottom:14 }}>AAJ SHURU KARO 🚀</h2>
              <p style={{ fontSize:16,color:'var(--w2)',marginBottom:32 }}>7 din free। Card nahi chahiye। Setup 5 min mein।</p>
              <Link href="/signup" style={{ display:'inline-flex',alignItems:'center',background:'var(--saffron)',color:'#000',fontWeight:700,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1.5,fontSize:16,padding:'15px 36px',borderRadius:6,textDecoration:'none' }}>
                FREE TRIAL SHURU KARO →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

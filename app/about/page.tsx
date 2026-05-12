'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
export default function AboutPage() {
  return (<>
    <Navbar/>
    <main style={{padding:'80px 0',position:'relative',zIndex:1}}>
      <div style={{maxWidth:760,margin:'0 auto',padding:'0 32px'}}>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:3,textTransform:'uppercase' as const,color:'var(--saffron)',display:'block',marginBottom:12}}>About</span>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(48px,7vw,88px)',lineHeight:.92,marginBottom:32}}>INDIA KE LIYE<br/><span style={{color:'var(--saffron)'}}>INDIA MEIN</span><br/>BANAYA</h1>
        <p style={{fontSize:17,color:'var(--w2)',lineHeight:1.8,marginBottom:24}}>LeadMachine ek Indian startup hai jo small business owners ke liye Instagram DM automation accessible banana chahti hai। Bade companies ke paas dedicated teams hoti hain leads handle karne ke liye — hum yeh power chhote businesses ko dete hain।</p>
        <p style={{fontSize:16,color:'var(--w2)',lineHeight:1.8,marginBottom:40}}>Hamare system mein Meta ke official Graph API use hoti hai — koi third party tool nahi, koi risky workarounds nahi। Razorpay se payment, Firebase se security, aur ek simple dashboard se sab kuch control।</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:48}}>
          {[['🇮🇳','Made in India','Ek Indian team ka product'],['🔒','Meta Compliant','Official Graph API only'],['💯','Transparent','Koi hidden charges nahi']].map(([icon,t,s])=>(
            <div key={t} style={{background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:12,padding:20,textAlign:'center' as const}}>
              <div style={{fontSize:28,marginBottom:10}}>{icon}</div>
              <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{t}</div>
              <div style={{fontSize:12,color:'var(--w3)'}}>{s}</div>
            </div>
          ))}
        </div>
        <div style={{background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:12,padding:28}}>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,marginBottom:12}}>HAMARA MISSION</h2>
          <p style={{fontSize:15,color:'var(--w2)',lineHeight:1.8}}>Har Indian small business ko Instagram pe 24/7 active rehne ki power dena — bina extra staff ke, bina bade budget ke। DM aaye aur lead automatically qualify ho jaye — yahi hamara goal hai।</p>
        </div>
      </div>
    </main>
    <Footer/>
  </>);
}

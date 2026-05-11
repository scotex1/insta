'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
const S={h2:{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,marginBottom:12,marginTop:40} as React.CSSProperties,p:{fontSize:14,color:'var(--w2)',lineHeight:1.8,marginBottom:12} as React.CSSProperties};
export default function TermsPage(){return(<><Navbar/><main style={{padding:'80px 0',position:'relative',zIndex:1}}><div style={{maxWidth:760,margin:'0 auto',padding:'0 32px'}}>
  <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:3,textTransform:'uppercase' as const,color:'var(--saffron)',display:'block',marginBottom:12}}>Legal</span>
  <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:64,lineHeight:.95,marginBottom:8}}>TERMS OF <span style={{color:'var(--saffron)'}}>SERVICE</span></h1>
  <p style={{...S.p,color:'var(--w3)',fontFamily:"'DM Mono',monospace",fontSize:11}}>Last updated: January 2025</p>
  <h2 style={S.h2}>Service Use</h2>
  <p style={S.p}>LeadMachine ek SaaS tool hai jo Instagram DM automation provide karta hai। Aap service sirf legal business purposes ke liye use kar sakte hain। Spam ya misleading content send karna prohibited hai।</p>
  <h2 style={S.h2}>Meta Platform Compliance</h2>
  <p style={S.p}>Aap agree karte hain ki Meta ke Platform Policies follow karenge। LeadMachine sirf official Instagram Graph API use karta hai। Policy violations ke liye aap khud responsible hain।</p>
  <h2 style={S.h2}>Payments & Refunds</h2>
  <p style={S.p}>Plans monthly hain। 7 din ke andar kisi bhi reason se full refund milega। Uske baad partial refund case-by-case basis pe decide hoga।</p>
  <h2 style={S.h2}>Account Suspension</h2>
  <p style={S.p}>Terms violate karne pe, jaise spam bhejne pe, account suspend ho sakta hai bina kisi prior notice ke।</p>
  <h2 style={S.h2}>Limitation of Liability</h2>
  <p style={S.p}>LeadMachine Instagram account bans ya Meta policy changes ke liye responsible nahi hai। Service "as is" provide ki jaati hai।</p>
  <h2 style={S.h2}>Contact</h2>
  <p style={S.p}>Legal inquiries: legal@leadmachine.in</p>
</div></main><Footer/></>);}

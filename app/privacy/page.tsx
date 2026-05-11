'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
const S={h2:{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,marginBottom:12,marginTop:40} as React.CSSProperties,p:{fontSize:14,color:'var(--w2)',lineHeight:1.8,marginBottom:12} as React.CSSProperties};
export default function PrivacyPage(){return(<><Navbar/><main style={{padding:'80px 0',position:'relative',zIndex:1}}><div style={{maxWidth:760,margin:'0 auto',padding:'0 32px'}}>
  <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:3,textTransform:'uppercase' as const,color:'var(--saffron)',display:'block',marginBottom:12}}>Legal</span>
  <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:64,lineHeight:.95,marginBottom:8}}>PRIVACY <span style={{color:'var(--saffron)'}}>POLICY</span></h1>
  <p style={{...S.p,color:'var(--w3)',fontFamily:"'DM Mono',monospace",fontSize:11}}>Last updated: January 2025</p>
  <h2 style={S.h2}>Data Collection</h2>
  <p style={S.p}>Hum sirf woh data collect karte hain jo service ke liye zaroori hai: aapka email, naam, aur Instagram leads data jo aapke users generate karte hain। Koi unnecessary data collect nahi hoti।</p>
  <h2 style={S.h2}>Instagram Data</h2>
  <p style={S.p}>Instagram messages aur leads sirf aapke account mein store hote hain। Hum aapka Instagram access token Firebase mein encrypted store karte hain aur sirf DM automation ke liye use karte hain।</p>
  <h2 style={S.h2}>Payment Data</h2>
  <p style={S.p}>Payment processing Razorpay karta hai jo PCI-DSS compliant hai। Hum aapka card number ya sensitive payment info kabhi store nahi karte।</p>
  <h2 style={S.h2}>Data Security</h2>
  <p style={S.p}>Sab data Firebase pe store hota hai jisme Google-grade encryption hai। Aapka data third parties ko kabhi nahi becha jaata।</p>
  <h2 style={S.h2}>Contact</h2>
  <p style={S.p}>Privacy concerns ke liye: privacy@leadmachine.in</p>
</div></main><Footer/></>);}

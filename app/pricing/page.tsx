'use client';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const f = (text: string, inc: boolean) => (
  <li key={text} style={{display:'flex',alignItems:'flex-start',gap:10,fontSize:14,padding:'9px 0',borderBottom:'1px solid var(--edge)'}}>
    <span style={{color:inc?'var(--green)':'var(--w3)',flexShrink:0}}>{inc?'✓':'✗'}</span>
    <span style={{color:inc?'var(--w2)':'var(--w3)'}}>{text}</span>
  </li>
);

const faqs = [
  ['7 din baad kya hoga?','Trial expire hone ke baad bot automatically pause ho jaayega. Koi charge nahi — sirf Pro upgrade karo bot continue karne ke liye।'],
  ['Card ki zaroorat hai?','Bilkul nahi। 7 din free trial ke liye koi payment info nahi chahiye।'],
  ['Cancel kaise karein?','Kabhi bhi dashboard se cancel kar sakte ho। Instant effect।'],
  ['Ek account pe kitne Instagram accounts?','Har LeadMachine account ek Instagram Business page se connect hota hai।'],
  ['Refund policy kya hai?','Agar 7 din ke andar koi problem ho toh full refund milega। No questions asked।'],
];

export default function PricingPage() {
  return (<>
    <Navbar/>
    <main style={{padding:'80px 0 100px',position:'relative',zIndex:1}}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 32px'}}>
        <div style={{textAlign:'center',marginBottom:72}}>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'var(--saffron)',display:'block',marginBottom:14}}>Pricing</span>
          <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:'clamp(56px,8vw,100px)',lineHeight:.92,letterSpacing:-1,marginBottom:20}}>
            SIMPLE, <span style={{color:'var(--saffron)'}}>HONEST</span> PRICING
          </h1>
          <p style={{fontSize:17,color:'var(--w2)',maxWidth:480,margin:'0 auto',lineHeight:1.7}}>Koi hidden fees nahi। Koi surprise charges nahi। Sirf ek plan — aur 7 din free।</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,maxWidth:800,margin:'0 auto 80px'}}>
          {/* Free */}
          <div style={{background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:20,padding:36}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:2,textTransform:'uppercase',color:'var(--w3)',marginBottom:14}}>Free Trial</div>
            <div style={{display:'flex',alignItems:'flex-end',gap:6,marginBottom:6}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:64,lineHeight:1}}>₹0</div>
              <div style={{fontSize:14,color:'var(--w3)',paddingBottom:10}}>7 days</div>
            </div>
            <p style={{fontSize:13,color:'var(--w2)',marginBottom:28,lineHeight:1.6}}>Bina card ke shuru karo। Bot try karo।</p>
            <ul style={{listStyle:'none',marginBottom:32}}>
              {f('Instagram DM automation',true)}
              {f('1 DM template',true)}
              {f('100 leads limit',true)}
              {f('Basic analytics',true)}
              {f('Custom templates',false)}
              {f('Priority support',false)}
            </ul>
            <Link href="/signup" style={{display:'block',textAlign:'center',background:'var(--ink3)',color:'var(--w)',fontWeight:700,fontSize:14,padding:'13px',borderRadius:8,textDecoration:'none',border:'1px solid var(--edge2)'}}>
              FREE SHURU KARO →
            </Link>
          </div>

          {/* Pro */}
          <div style={{background:'linear-gradient(135deg,var(--ink2),#1a0a00)',border:'1px solid var(--saffron)',borderRadius:20,padding:36,position:'relative',overflow:'hidden',boxShadow:'0 0 60px rgba(255,107,0,.1)'}}>
            <div style={{position:'absolute',top:22,right:-28,background:'var(--saffron)',color:'#000',fontFamily:"'DM Mono',monospace",fontSize:9,fontWeight:500,letterSpacing:2,padding:'4px 36px',transform:'rotate(35deg)'}}>BEST VALUE</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:2,textTransform:'uppercase',color:'var(--saffron)',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:'var(--green)',display:'inline-block'}}/>Pro
            </div>
            <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(0,255,136,.08)',border:'1px solid rgba(0,255,136,.2)',color:'var(--green)',fontSize:11,fontWeight:700,padding:'5px 12px',borderRadius:20,marginBottom:14}}>
              ✓ 7 DIN FREE TRIAL INCLUDED
            </div>
            <div style={{display:'flex',alignItems:'flex-end',gap:6,marginBottom:6}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:64,lineHeight:1,color:'var(--saffron)'}}>₹499</div>
              <div style={{fontSize:14,color:'var(--w3)',paddingBottom:10}}>/month</div>
            </div>
            <p style={{fontSize:13,color:'var(--w2)',marginBottom:28,lineHeight:1.6}}>Serious businesses ke liye। Unlimited power।</p>
            <ul style={{listStyle:'none',marginBottom:32}}>
              {f('Unlimited Instagram DMs',true)}
              {f('5 Custom Templates',true)}
              {f('Unlimited leads',true)}
              {f('Advanced analytics',true)}
              {f('Priority support',true)}
              {f('No LeadMachine branding',true)}
            </ul>
            <Link href="/signup" style={{display:'block',textAlign:'center',background:'var(--saffron)',color:'#000',fontWeight:700,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1,fontSize:16,padding:'14px',borderRadius:8,textDecoration:'none'}}>
              7 DIN FREE SHURU KARO →
            </Link>
            <p style={{fontSize:11,color:'var(--w3)',textAlign:'center',marginTop:10}}>UPI · Cards · Netbanking · Cancel anytime</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{maxWidth:680,margin:'0 auto'}}>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:40,textAlign:'center',marginBottom:32}}>AKSAR PUCHE JAANE WALE SAWAAL</h2>
          {faqs.map(([q,a])=>(
            <details key={q} style={{borderBottom:'1px solid var(--edge)'}}>
              <summary style={{cursor:'pointer',padding:'18px 0',fontSize:15,fontWeight:600,listStyle:'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                {q} <span style={{color:'var(--saffron)',fontSize:18}}>+</span>
              </summary>
              <p style={{fontSize:14,color:'var(--w2)',lineHeight:1.7,paddingBottom:18}}>{a}</p>
            </details>
          ))}
        </div>

        {/* Guarantee */}
        <div style={{maxWidth:600,margin:'56px auto 0',textAlign:'center',background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:20,padding:40}}>
          <div style={{fontSize:48,marginBottom:14}}>🛡️</div>
          <h3 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,marginBottom:10}}>7-DIN MONEY BACK GUARANTEE</h3>
          <p style={{fontSize:14,color:'var(--w2)',lineHeight:1.7}}>Agar pehle 7 din mein koi problem ho — koi sawaal nahi, full refund milega। Hum chahte hain ki tum satisfied raho।</p>
        </div>
      </div>
    </main>
    <Footer/>
  </>);
}

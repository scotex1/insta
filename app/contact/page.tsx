'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';
export default function ContactPage() {
  const [f,setF]=useState({name:'',email:'',msg:''});
  const [sent,setSent]=useState(false);
  const handle=async(e:React.FormEvent)=>{e.preventDefault();setSent(true);toast.success('Message bheja gaya! 24hrs mein reply milega।');};
  return (<>
    <Navbar/>
    <main style={{padding:'80px 0',position:'relative',zIndex:1}}>
      <div style={{maxWidth:600,margin:'0 auto',padding:'0 32px'}}>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:3,textTransform:'uppercase' as const,color:'var(--saffron)',display:'block',marginBottom:12}}>Contact</span>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:64,lineHeight:.95,marginBottom:12}}>BAT KARO<br/><span style={{color:'var(--saffron)'}}>HUMSE</span></h1>
        <p style={{fontSize:15,color:'var(--w2)',marginBottom:40,lineHeight:1.7}}>Koi bhi sawaal ho toh message karo। 24 ghante mein reply milega।</p>
        {sent?(
          <div style={{textAlign:'center' as const,background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:16,padding:40}}>
            <div style={{fontSize:48,marginBottom:16}}>✅</div>
            <h3 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,marginBottom:8}}>MESSAGE MILA!</h3>
            <p style={{color:'var(--w2)',fontSize:14}}>24 ghante mein aapko reply milega।</p>
          </div>
        ):(
          <div style={{background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:16,padding:32}}>
            <form onSubmit={handle}>
              {([['Naam','text','name','Aapka naam'],['Email','email','email','aap@email.com']] as const).map(([l,t,k,p])=>(
                <div key={k} style={{marginBottom:16}}>
                  <label style={{display:'block',marginBottom:7,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase' as const,color:'var(--w3)'}}>{l}</label>
                  <input type={t} required placeholder={p} value={(f as any)[k]} onChange={e=>setF(x=>({...x,[k]:e.target.value}))}
                    style={{width:'100%',background:'var(--ink3)',border:'1px solid var(--edge2)',borderRadius:6,padding:'11px 14px',color:'var(--w)',fontSize:14,outline:'none'}}/>
                </div>
              ))}
              <div style={{marginBottom:20}}>
                <label style={{display:'block',marginBottom:7,fontSize:11,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase' as const,color:'var(--w3)'}}>Message</label>
                <textarea required rows={5} placeholder="Koi bhi sawaal..." value={f.msg} onChange={e=>setF(x=>({...x,msg:e.target.value}))}
                  style={{width:'100%',background:'var(--ink3)',border:'1px solid var(--edge2)',borderRadius:6,padding:'11px 14px',color:'var(--w)',fontSize:14,outline:'none',resize:'vertical' as const,fontFamily:"'DM Sans',sans-serif"}}/>
              </div>
              <button type="submit" style={{width:'100%',background:'var(--saffron)',color:'#000',fontWeight:700,fontSize:14,padding:'12px',borderRadius:8,border:'none',cursor:'pointer'}}>BHEJO →</button>
            </form>
          </div>
        )}
        <div style={{marginTop:32,display:'flex',gap:16,flexWrap:'wrap' as const}}>
          {[['📧','Email','support@leadmachine.in'],['📱','WhatsApp','+91 98765 43210'],['🕐','Response','24 hours']].map(([i,l,v])=>(
            <div key={l} style={{flex:1,minWidth:140,background:'var(--ink2)',border:'1px solid var(--edge)',borderRadius:12,padding:'16px 20px',textAlign:'center' as const}}>
              <div style={{fontSize:24,marginBottom:6}}>{i}</div>
              <div style={{fontSize:11,color:'var(--w3)',fontFamily:"'DM Mono',monospace",letterSpacing:1,textTransform:'uppercase' as const,marginBottom:4}}>{l}</div>
              <div style={{fontSize:13,color:'var(--w)'}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
    <Footer/>
  </>);
}

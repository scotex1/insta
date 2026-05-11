import { Suspense } from 'react';
import CallbackInner from './CallbackInner';
export default function MetaCallbackPage() {
  return <Suspense fallback={<Loading/>}><CallbackInner/></Suspense>;
}
function Loading() {
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16,position:'relative',zIndex:1}}>
      <div style={{width:40,height:40,borderRadius:'50%',border:'3px solid rgba(255,255,255,.1)',borderTopColor:'var(--saffron)',animation:'spin .65s linear infinite'}}/>
      <p style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:'var(--w3)'}}>Instagram connecting...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

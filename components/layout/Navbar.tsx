'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { firebaseUser, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out');
    router.push('/');
  };

  const links = [
    { href: '/#how',    label: 'How it Works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about',   label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 300,
      borderBottom: '1px solid var(--edge)',
      background: 'rgba(8,8,16,0.9)',
      backdropFilter: 'blur(20px)',
      height: '60px', display: 'flex', alignItems: 'center',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, color: 'var(--w)', textDecoration: 'none' }}>
          <span style={{ color: 'var(--saffron)' }}>L</span>EAD<span style={{ color: 'var(--saffron)' }}>M</span>ACHINE
        </Link>

        <div style={{ display: 'flex', gap: 2 }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontSize: 13, fontWeight: 500,
              color: pathname === l.href ? 'var(--saffron)' : 'var(--w3)',
              textDecoration: 'none', padding: '6px 14px', borderRadius: 6,
              transition: 'all .15s',
            }}>{l.label}</Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {firebaseUser ? (
            <>
              <Link href="/dashboard" className="btn-nav">Dashboard</Link>
              <button onClick={handleLogout} className="btn-nav-ghost">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-nav-ghost">Login</Link>
              <Link href="/signup" style={{
                background: 'var(--saffron)', color: '#000', fontWeight: 700,
                fontSize: 12, padding: '6px 14px', borderRadius: 6, textDecoration: 'none',
              }}>7 Din Free →</Link>
            </>
          )}
        </div>
      </div>
      <style>{`
        .btn-nav { font-size:13px; font-weight:500; color:var(--w2); text-decoration:none; padding:6px 14px; border-radius:6px; background:var(--ink3); transition:all .15s; }
        .btn-nav:hover { color:var(--w); }
        .btn-nav-ghost { font-size:13px; font-weight:500; color:var(--w3); background:none; border:none; cursor:pointer; padding:6px 14px; border-radius:6px; transition:all .15s; }
        .btn-nav-ghost:hover { color:var(--w); background:var(--ink3); }
        @media(max-width:768px) { nav div:nth-child(2) { display:none; } }
      `}</style>
    </nav>
  );
}

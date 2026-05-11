import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--edge)', padding: '36px 32px', marginTop: 'auto', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1 }}>
          <span style={{ color: 'var(--saffron)' }}>L</span>M
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[['Pricing','/pricing'],['About','/about'],['Contact','/contact'],['Terms','/terms'],['Privacy','/privacy']].map(([l,h]) => (
            <Link key={h} href={h} style={{ color: 'var(--w3)', textDecoration: 'none', fontSize: 13, transition: 'color .15s' }}>{l}</Link>
          ))}
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: 'var(--w3)' }}>© 2025 LEADMACHINE · MADE IN 🇮🇳</div>
      </div>
    </footer>
  );
}

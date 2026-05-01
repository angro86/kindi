// Browse — full category browser + search field.

const CATS = [
  { name: 'Science',  c: 'var(--kindi-sky)',    ic: Icon.flask, n: 28 },
  { name: 'Animals',  c: 'var(--kindi-mint)',   ic: Icon.eye,   n: 41 },
  { name: 'Stories',  c: 'var(--kindi-butter)', ic: Icon.book,  n: 22 },
  { name: 'Music',    c: 'var(--kindi-lilac)',  ic: Icon.music, n: 18 },
  { name: 'Make',     c: 'var(--kindi-blush)',  ic: Icon.paint, n: 35 },
  { name: 'World',    c: 'var(--kindi-mint)',   ic: Icon.globe, n: 26 },
  { name: 'Space',    c: 'var(--kindi-sky)',    ic: Icon.bolt,  n: 14 },
  { name: 'Nature',   c: 'var(--kindi-butter)', ic: Icon.sun,   n: 31 },
];

function Browse({ device = 'desktop' }) {
  const isMobile = device === 'mobile';
  return (
    <div className="kindi-body" style={{
      width: '100%', minHeight: '100%', background: 'var(--kindi-cream)',
      padding: isMobile ? '20px 18px 36px' : '28px 40px 48px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <Button variant="secondary" size="sm" icon={Icon.arrowL(13)}>Back</Button>
        <h1 className="t-h1" style={{ margin: 0 }}>Find something <span className="squig">cool.</span></h1>
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 16px', borderRadius: 14,
        background: 'var(--kindi-paper)',
        border: '1px solid var(--kindi-line-2)',
        boxShadow: 'var(--shadow-xs)',
        marginBottom: 24,
      }}>
        {Icon.search(18, 'var(--kindi-ink-soft)')}
        <input placeholder="Search videos, channels, topics…" style={{
          flex: 1, border: 'none', background: 'transparent', outline: 'none',
          fontSize: 15, fontWeight: 600, color: 'var(--kindi-ink)',
        }}/>
        <kbd style={{
          padding: '3px 8px', borderRadius: 6, background: 'var(--kindi-cream-3)',
          fontFamily: 'var(--kindi-mono)', fontSize: 11, fontWeight: 700, color: 'var(--kindi-ink-soft)',
        }}>⌘K</kbd>
      </div>

      {/* Category tiles */}
      <h3 className="t-h3" style={{ marginBottom: 12 }}>Browse by topic</h3>
      <div style={{
        display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
        gap: 12, marginBottom: 32,
      }}>
        {CATS.map(c => (
          <button key={c.name} style={{
            padding: 18, borderRadius: 16, background: c.c,
            border: '1px solid rgba(40,30,20,0.06)',
            display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start',
            cursor: 'pointer', textAlign: 'left',
            boxShadow: 'var(--shadow-xs)', minHeight: 120,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(255,255,255,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{c.ic(20, 'var(--kindi-ink)')}</div>
            <div style={{ flex: 1 }}>
              <div className="kindi-display" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{c.name}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--kindi-ink-soft)', marginTop: 2 }}>{c.n} videos</div>
            </div>
          </button>
        ))}
      </div>

      {/* Recent searches / trending */}
      <h3 className="t-h3" style={{ marginBottom: 12 }}>Trending with kids your age</h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['why is the sky blue', 'how do cats purr', 'octopus facts', 'easy origami', 'volcanoes', 'space rockets', 'rainbow science'].map(t => (
          <Chip key={t} icon={Icon.search(11, 'var(--kindi-ink-soft)')}>{t}</Chip>
        ))}
      </div>
    </div>
  );
}
Object.assign(window, { Browse });

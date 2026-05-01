// ProfilePicker — "Who is watching?" entry screen.
// Big tappable kid tiles, plus parent door behind a PIN gate.

const PROFILES = [
  { name: 'Mila',  color: 'var(--kindi-coral)',   age: 7, mood: 'happy', stars: 124 },
  { name: 'Theo',  color: 'var(--kindi-mint-mid)',age: 5, mood: 'wow',   stars: 58  },
  { name: 'Juno',  color: 'var(--kindi-butter-mid)',age: 9,mood: 'wink', stars: 211 },
];

function ProfilePicker({ device = 'desktop' }) {
  const isMobile = device === 'mobile';
  return (
    <div className="kindi-body" style={{
      width: '100%', minHeight: '100%',
      background: 'linear-gradient(160deg, oklch(0.94 0.04 80) 0%, oklch(0.92 0.06 35) 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: isMobile ? '36px 18px' : '64px 32px',
    }}>
      <KindiLogo size={isMobile ? 20 : 24}/>
      <div className="t-label" style={{ marginTop: 22 }}>Tap your friend</div>
      <h1 className="kindi-display" style={{
        margin: '6px 0 36px', fontSize: isMobile ? 36 : 56, fontWeight: 600, letterSpacing: '-0.03em', textAlign: 'center',
      }}>
        Who is <span className="squig">watching?</span>
      </h1>
      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${PROFILES.length + 1}, 1fr)`,
        gap: isMobile ? 14 : 22, maxWidth: 720, width: '100%',
      }}>
        {PROFILES.map(p => (
          <button key={p.name} style={{
            background: 'transparent', border: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            cursor: 'pointer',
          }}>
            <div style={{
              width: isMobile ? 84 : 124, height: isMobile ? 84 : 124, borderRadius: 999,
              background: p.color, position: 'relative',
              boxShadow: '0 6px 20px rgba(40,30,20,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform .14s',
            }}>
              <KindiBlob color={p.color} size={isMobile ? 84 : 124} mood={p.mood}/>
              <div style={{
                position: 'absolute', bottom: -4, right: -4,
                padding: '3px 8px', borderRadius: 999,
                background: 'var(--kindi-paper)',
                fontSize: 11, fontWeight: 800, fontFamily: 'var(--kindi-body)',
                display: 'inline-flex', alignItems: 'center', gap: 3,
                boxShadow: '0 2px 6px rgba(40,30,20,0.15)',
              }}>{Icon.star(10, 'oklch(0.78 0.16 75)')} {p.stars}</div>
            </div>
            <div className="kindi-display" style={{ fontSize: isMobile ? 18 : 22, fontWeight: 600 }}>{p.name}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--kindi-ink-soft)' }}>{p.age} years old</div>
          </button>
        ))}
        {/* Add kid */}
        <button style={{
          background: 'transparent', border: 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          cursor: 'pointer', opacity: 0.6,
        }}>
          <div style={{
            width: isMobile ? 84 : 124, height: isMobile ? 84 : 124, borderRadius: 999,
            border: '2px dashed var(--kindi-line-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icon.plus(28, 'var(--kindi-ink-soft)')}</div>
          <div className="kindi-display" style={{ fontSize: isMobile ? 18 : 22, fontWeight: 600 }}>Add kid</div>
        </button>
      </div>
      <div style={{ marginTop: 'auto', paddingTop: 48 }}>
        <button style={{
          padding: '10px 18px', borderRadius: 999,
          background: 'var(--kindi-paper)', border: '1px solid var(--kindi-line-2)',
          fontSize: 13, fontWeight: 700, color: 'var(--kindi-ink-soft)',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: 'var(--shadow-xs)',
        }}>{Icon.lock(13)} I'm a parent · enter PIN</button>
      </div>
    </div>
  );
}
Object.assign(window, { ProfilePicker });

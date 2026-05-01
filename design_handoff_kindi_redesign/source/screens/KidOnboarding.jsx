// KidOnboarding — first-run kid flow: pick avatar, pick interests, ready to watch.

function KidOnboarding({ device = 'desktop' }) {
  const isMobile = device === 'mobile';
  return (
    <div className="kindi-body" style={{
      width: '100%', minHeight: '100%',
      background: 'linear-gradient(160deg, oklch(0.94 0.05 305) 0%, oklch(0.94 0.05 35) 100%)',
      padding: isMobile ? '24px 18px 32px' : '40px 32px',
    }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 720, margin: '0 auto 20px' }}>
        <KindiLogo size={isMobile ? 16 : 18}/>
        <div style={{ flex: 1, display: 'flex', gap: 6 }}>
          {[1,1,0].map((s,i) => (
            <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: s ? 'var(--kindi-coral-deep)' : 'var(--kindi-line-2)' }}/>
          ))}
        </div>
        <span className="t-label">Step 2 of 3</span>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <KindiBlob color="var(--kindi-coral)" size={isMobile ? 64 : 88} mood="wow"/>
        <h1 className="kindi-display" style={{
          margin: '14px 0 8px', fontSize: isMobile ? 30 : 44, fontWeight: 600, letterSpacing: '-0.03em',
        }}>
          What do you <span className="squig">love?</span>
        </h1>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--kindi-ink-soft)' }}>
          Pick at least 3. We'll fill your library with these things.
        </p>

        <div style={{
          marginTop: 28, display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? 10 : 14,
        }}>
          {[
            ['Animals', Icon.fox || Icon.eye, 'var(--kindi-mint)',  true],
            ['Space',   Icon.atom || Icon.bolt,'var(--kindi-sky)',   true],
            ['Stories', Icon.book,             'var(--kindi-butter)',true],
            ['Music',   Icon.music,            'var(--kindi-lilac)', false],
            ['Cooking', Icon.flask,            'var(--kindi-blush)', false],
            ['Drawing', Icon.paint,            'var(--kindi-mint)',  true],
            ['World',   Icon.globe,            'var(--kindi-butter)',false],
            ['Science', Icon.flask,            'var(--kindi-sky)',   true],
          ].map(([label, ico, c, sel], i) => (
            <button key={i} style={{
              padding: isMobile ? '14px 10px' : '20px 14px', borderRadius: 18,
              background: sel ? c : 'var(--kindi-paper)',
              border: sel ? `2px solid var(--kindi-ink)` : '1px solid var(--kindi-line)',
              boxShadow: sel ? '0 4px 12px rgba(40,30,20,0.15)' : 'var(--shadow-xs)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              cursor: 'pointer', position: 'relative',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: sel ? 'var(--kindi-paper)' : c,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{ico(24, 'var(--kindi-ink)')}</div>
              <div style={{ fontSize: 13.5, fontWeight: 800 }}>{label}</div>
              {sel && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 22, height: 22, borderRadius: 999,
                  background: 'var(--kindi-ink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{Icon.check(12, '#fff')}</div>
              )}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 32, display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Button variant="secondary" size="lg">Back</Button>
          <Button variant="primary" size="lg" iconRight={Icon.arrowR(14, '#fff')}>Continue · 4 picked</Button>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { KidOnboarding });

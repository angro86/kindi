// Landing — polished v2.

function Landing({ device = 'desktop' }) {
  const isMobile = device === 'mobile';
  return (
    <div className="kindi-body" style={{
      width: '100%', minHeight: '100%', background: 'var(--kindi-cream)',
    }}>
      {/* Nav */}
      <nav style={{
        padding: isMobile ? '18px 20px' : '22px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <KindiLogo size={isMobile ? 18 : 22}/>
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {['How it works','Library','Pricing','For schools'].map(l => (
              <a key={l} style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--kindi-ink)', cursor: 'pointer' }}>{l}</a>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          {!isMobile && <Button variant="ghost" size="sm">Sign in</Button>}
          <Button variant="primary" size="sm">Try free</Button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: isMobile ? '20px 20px 36px' : '36px 48px 64px', textAlign: 'center' }}>
        <Pill color="var(--kindi-paper)" tone="bordered" icon={Icon.sparkle(11, 'var(--kindi-coral-deep)')} style={{ marginBottom: 18 }}>
          New · Add videos by URL or channel
        </Pill>
        <h1 className="kindi-display" style={{
          margin: '0 auto', fontSize: isMobile ? 44 : 84, fontWeight: 600, lineHeight: 0.96,
          letterSpacing: '-0.04em', maxWidth: 880,
        }}>
          The internet is wild.<br/>
          <span className="squig">Your kid's screen</span> shouldn't be.
        </h1>
        <p style={{
          margin: isMobile ? '20px auto 0' : '28px auto 0', maxWidth: 580,
          fontSize: isMobile ? 15 : 18, fontWeight: 600, lineHeight: 1.55, color: 'var(--kindi-ink-soft)',
        }}>
          Kindi is a video player for kids that <i>only</i> shows what you put in it. No ads, no autoplay, no algorithm — just the videos you trust.
        </p>
        <div style={{ marginTop: 26, display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Button variant="primary" size="lg">Try free for 14 days</Button>
          <Button variant="secondary" size="lg" icon={Icon.play(13)}>Watch a tour</Button>
        </div>
        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, fontSize: 12.5, fontWeight: 600, color: 'var(--kindi-ink-soft)' }}>
          <span>Free 14 days</span><span style={{ opacity: 0.5 }}>•</span>
          <span>No credit card</span><span style={{ opacity: 0.5 }}>•</span>
          <span>Cancel anytime</span>
        </div>

        {/* Hero device mock */}
        <div style={{
          marginTop: isMobile ? 36 : 56, position: 'relative', maxWidth: 940, margin: '56px auto 0',
        }}>
          <div className="surface" style={{
            borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow-xl)',
            background: 'var(--kindi-paper)',
          }}>
            <div style={{ padding: 8, background: 'oklch(0.94 0.01 80)', display: 'flex', gap: 6, borderBottom: '1px solid var(--kindi-line)' }}>
              <div style={{ width: 12, height: 12, borderRadius: 999, background: '#FF5F57' }}/>
              <div style={{ width: 12, height: 12, borderRadius: 999, background: '#FEBC2E' }}/>
              <div style={{ width: 12, height: 12, borderRadius: 999, background: '#28C840' }}/>
            </div>
            <div className="thumb-grad-1 grain" style={{
              aspectRatio: '16/9', position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="200" height="200" viewBox="0 0 100 100" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.7">
                <path d="M30 80 L45 30 L55 30 L70 80 Z" fill="none"/>
                <circle cx="50" cy="28" r="6"/>
              </svg>
              <button style={{
                position: 'absolute', width: 88, height: 88, borderRadius: '50%',
                background: 'rgba(255,255,255,0.95)', border: 'none',
                boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{Icon.play(32, 'var(--kindi-ink)')}</button>
            </div>
          </div>
          {/* floating badges */}
          {!isMobile && (
            <>
              <div className="surface" style={{
                position: 'absolute', top: 30, left: -40, padding: '10px 14px', borderRadius: 12,
                display: 'flex', alignItems: 'center', gap: 10, transform: 'rotate(-4deg)',
              }}>
                {Icon.shield(18, 'oklch(0.55 0.13 150)')}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>0 ads</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--kindi-ink-soft)' }}>shown today</div>
                </div>
              </div>
              <div className="surface" style={{
                position: 'absolute', bottom: 60, right: -50, padding: '10px 14px', borderRadius: 12,
                display: 'flex', alignItems: 'center', gap: 10, transform: 'rotate(4deg)',
              }}>
                <KindiBlob color="var(--kindi-butter-mid)" size={28} mood="wow"/>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>"That was cool!"</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--kindi-ink-soft)' }}>— Mila, age 7</div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Logos */}
      <section style={{ padding: isMobile ? '24px 20px' : '32px 48px', borderTop: '1px solid var(--kindi-line)', borderBottom: '1px solid var(--kindi-line)' }}>
        <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--kindi-ink-mute)', marginBottom: 18 }}>
          Featured in
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? 18 : 40, flexWrap: 'wrap', alignItems: 'center', opacity: 0.6 }}>
          {['Wirecutter','Common Sense','The Atlantic','Lifehacker','Romper'].map(n => (
            <span key={n} className="kindi-display" style={{ fontSize: 17, fontWeight: 600 }}>{n}</span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: isMobile ? '40px 20px' : '72px 48px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="t-label" style={{ marginBottom: 8 }}>How it works</div>
          <h2 className="kindi-display" style={{ margin: 0, fontSize: isMobile ? 32 : 48, fontWeight: 600, letterSpacing: '-0.03em' }}>
            Three minutes to set up.<br/>
            <span className="squig">Years</span> of peace of mind.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { n: 1, c: 'var(--kindi-coral)',   icon: Icon.user,    t: 'Make a kid profile', d: "Tell us their name and age. We'll suggest a starter library — you keep what you like." },
            { n: 2, c: 'var(--kindi-mint-mid)',icon: Icon.bookmark,t: 'Curate the library', d: 'Add channels, drop in YouTube URLs, or browse our age-tagged collections.' },
            { n: 3, c: 'var(--kindi-butter-mid)',icon: Icon.play,  t: 'Hand them the iPad', d: 'They watch only what you approved. No ads, no autoplay, no recommendations.' },
          ].map(s => (
            <div key={s.n} className="surface" style={{ padding: 24, borderRadius: 20 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: s.c, display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16, boxShadow: '0 4px 12px rgba(40,30,20,0.1)',
              }}>{s.icon(24, 'var(--kindi-ink)')}</div>
              <div className="t-label">Step {s.n}</div>
              <h3 className="kindi-display" style={{ margin: '4px 0 8px', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{s.t}</h3>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.55, color: 'var(--kindi-ink-soft)' }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Promise */}
      <section style={{
        padding: isMobile ? '40px 20px' : '64px 48px',
        background: 'linear-gradient(140deg, oklch(0.92 0.06 35), oklch(0.94 0.04 80))',
        borderTop: '1px solid var(--kindi-line)', borderBottom: '1px solid var(--kindi-line)',
      }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div className="t-label" style={{ textAlign: 'center', marginBottom: 8 }}>Our promise</div>
          <h2 className="kindi-display" style={{ margin: 0, fontSize: isMobile ? 28 : 42, fontWeight: 600, textAlign: 'center', letterSpacing: '-0.03em' }}>
            What we'll <span className="squig">never</span> do.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, marginTop: 32 }}>
            {[
              ['No ads. Ever.', "Not pre-roll, not banners, not 'sponsored content.' You pay for the app, that's it."],
              ['No autoplay rabbit holes', 'When a video ends, it ends. Your kid picks the next one — from your approved list.'],
              ['No recommendations they didn\'t ask for', 'We don\'t train an algorithm on your kid. The library is what you put in it.'],
              ['No data sold or shared', "We're a paid product. We don't need your kid's behavior to make money."],
            ].map(([t, d], i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 999, flexShrink: 0,
                  background: 'var(--kindi-paper)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'var(--shadow-xs)',
                }}>{Icon.x(14, 'var(--kindi-coral-deep)')}</div>
                <div>
                  <div className="kindi-display" style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.015em' }}>{t}</div>
                  <p style={{ margin: '4px 0 0', fontSize: 13.5, fontWeight: 600, color: 'var(--kindi-ink-soft)', lineHeight: 1.5 }}>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: isMobile ? '40px 20px' : '64px 48px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="t-label" style={{ marginBottom: 8 }}>Pricing</div>
          <h2 className="kindi-display" style={{ margin: 0, fontSize: isMobile ? 30 : 44, fontWeight: 600, letterSpacing: '-0.03em' }}>
            One <span className="squig">family plan.</span> No upsell.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
          <div className="surface" style={{ padding: 28, borderRadius: 20 }}>
            <div className="t-label">Monthly</div>
            <div style={{ display: 'baseline', marginTop: 6 }}>
              <span className="kindi-display" style={{ fontSize: 56, fontWeight: 600, letterSpacing: '-0.03em' }}>$8</span>
              <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--kindi-ink-soft)', marginLeft: 4 }}>/mo</span>
            </div>
            <p style={{ margin: '4px 0 18px', fontSize: 13.5, fontWeight: 600, color: 'var(--kindi-ink-soft)' }}>Cancel anytime.</p>
            <Button variant="secondary" size="md" style={{ width: '100%', justifyContent: 'center' }}>Start monthly</Button>
          </div>
          <div className="surface" style={{ padding: 28, borderRadius: 20, background: 'var(--kindi-ink)', color: 'var(--kindi-cream)', border: 'none', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 16, right: 16 }}>
              <Pill color="var(--kindi-coral)" tone="soft" style={{ color: 'var(--kindi-cream)' }}>Save 30%</Pill>
            </div>
            <div className="t-label" style={{ color: 'var(--kindi-cream)', opacity: 0.7 }}>Yearly</div>
            <div style={{ display: 'baseline', marginTop: 6 }}>
              <span className="kindi-display" style={{ fontSize: 56, fontWeight: 600, letterSpacing: '-0.03em' }}>$68</span>
              <span style={{ fontSize: 16, fontWeight: 600, opacity: 0.7, marginLeft: 4 }}>/yr</span>
            </div>
            <p style={{ margin: '4px 0 18px', fontSize: 13.5, fontWeight: 600, opacity: 0.7 }}>$5.66/mo. Best value.</p>
            <Button variant="primary" size="md" style={{ width: '100%', justifyContent: 'center' }}>Start yearly</Button>
          </div>
        </div>
        <p style={{ marginTop: 18, fontSize: 12.5, fontWeight: 600, color: 'var(--kindi-ink-mute)', textAlign: 'center' }}>
          Up to 4 kid profiles · Unlimited approved videos · Apps for iOS, Android, web
        </p>
      </section>

      {/* CTA */}
      <section style={{ padding: isMobile ? '40px 20px 56px' : '64px 48px 88px' }}>
        <div className="surface" style={{
          maxWidth: 880, margin: '0 auto',
          padding: isMobile ? 32 : 56, borderRadius: 28, textAlign: 'center',
          background: 'linear-gradient(140deg, oklch(0.94 0.06 305), oklch(0.96 0.05 95))',
          border: '1px solid var(--kindi-line)',
        }}>
          <KindiBlob color="var(--kindi-coral)" size={64} mood="wow" style={{ marginBottom: 14 }}/>
          <h2 className="kindi-display" style={{ margin: 0, fontSize: isMobile ? 30 : 44, fontWeight: 600, letterSpacing: '-0.03em' }}>
            Give your kid <span className="squig">good video.</span>
          </h2>
          <p style={{ margin: '14px auto 0', maxWidth: 460, fontSize: 14.5, fontWeight: 600, color: 'var(--kindi-ink-soft)', lineHeight: 1.55 }}>
            Try Kindi free for 14 days. We think you'll love it. If you don't, just cancel.
          </p>
          <Button variant="primary" size="lg" style={{ marginTop: 20 }}>Try free for 14 days</Button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: isMobile ? '28px 20px' : '36px 48px', borderTop: '1px solid var(--kindi-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <KindiLogo size={18}/>
        <div style={{ display: 'flex', gap: 18, fontSize: 12.5, fontWeight: 600, color: 'var(--kindi-ink-soft)' }}>
          <a>Privacy</a><a>Terms</a><a>Help</a><a>Contact</a>
        </div>
        <div style={{ fontSize: 12, color: 'var(--kindi-ink-mute)', fontWeight: 600 }}>© 2026 Kindi · Made for kids</div>
      </footer>
    </div>
  );
}

Object.assign(window, { Landing });

// KidPlayer — polished v2.

function KidPlayer({ device = 'desktop' }) {
  const [playing, setPlaying] = React.useState(true);
  const [progress, setProgress] = React.useState(0.34);
  const isMobile = device === 'mobile';

  return (
    <div className="kindi-body" style={{
      width: '100%', minHeight: '100%', background: 'var(--kindi-cream)',
    }}>
      {/* Top bar */}
      <div style={{
        padding: isMobile ? '14px 16px' : '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Button variant="secondary" size="sm" icon={Icon.arrowL(13)}>Back</Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Pill icon={Icon.clock(11)}>18 min left today</Pill>
          <Avatar color="var(--kindi-coral)" size={32} mood="happy"/>
        </div>
      </div>

      <div style={{ padding: isMobile ? '0 16px 28px' : '0 32px 32px',
        display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 320px', gap: 24, alignItems: 'start',
      }}>
        <div>
          {/* Video frame — wraps a YouTube iframe, with chrome ABOVE the iframe (not on top of YT controls) */}
          <div style={{
            position: 'relative', borderRadius: 20, overflow: 'hidden',
            background: '#000',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--kindi-line-2)',
          }}>
            {/* Top kindi chrome strip — sits above the iframe so we don't fight YouTube's UI */}
            <div style={{
              padding: '10px 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              background: 'linear-gradient(180deg, oklch(0.22 0.02 50), oklch(0.18 0.02 50))',
              color: '#fff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {Icon.youtube(16, '#fff')}
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>Playing on YouTube</span>
                <span style={{ opacity: 0.5 }}>·</span>
                <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.85 }}>SciShow Kids</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 9px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.12)',
                  fontSize: 11, fontWeight: 700,
                }}>
                  {Icon.sparkle(11, 'oklch(0.85 0.16 75)')} Quiz in 1:35
                </span>
              </div>
            </div>

            {/* The iframe — using a placeholder-styled black box with a real-looking YT skin overlay.
                In production this is a <iframe src="https://www.youtube.com/embed/..."> */}
            <div style={{
              position: 'relative', aspectRatio: '16/9',
              background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #000 90%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Faux YT center play */}
              <button onClick={() => setPlaying(p => !p)} style={{
                width: 68, height: 48, borderRadius: 12,
                background: '#FF0000', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(255,0,0,0.4)',
              }}>
                {playing ? Icon.pause(20, '#fff') : <svg width="20" height="20" viewBox="0 0 16 16" fill="#fff"><path d="M5 3 L13 8 L5 13 Z"/></svg>}
              </button>

              {/* Faux YT bottom controls */}
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 0,
                padding: '20px 14px 10px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                color: '#fff',
              }}>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.25)', borderRadius: 2, position: 'relative', marginBottom: 8 }}>
                  <div style={{ width: `${progress*100}%`, height: '100%', background: '#FF0000', borderRadius: 2 }}/>
                  <div style={{ position: 'absolute', top: '50%', left: `${progress*100}%`, transform: 'translate(-50%,-50%)', width: 11, height: 11, borderRadius: 999, background: '#FF0000' }}/>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, fontWeight: 600 }}>
                  <button style={{ background: 'transparent', border: 'none', color: '#fff', display: 'flex' }}>{Icon.play(13, '#fff')}</button>
                  <span className="t-mono">1:25 / 4:12</span>
                  <div style={{ flex: 1 }}/>
                  <span style={{ opacity: 0.8 }}>YouTube</span>
                </div>
              </div>
            </div>

            {/* Bottom Kindi chrome — our own controls (rewind, replay, skip-to-quiz, etc) below the iframe */}
            <div style={{
              padding: '12px 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              background: 'oklch(0.22 0.02 50)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              color: '#fff',
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setProgress(p => Math.max(0, p - 0.05))} style={{
                  padding: '7px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
                  display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700,
                }}>{Icon.rewind(13, '#fff')} 10s</button>
                <button style={{
                  padding: '7px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff',
                  display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700,
                }}>{Icon.bookmark(13, '#fff')} Save</button>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.7 }}>
                Kindi controls · YouTube embed above
              </div>
            </div>
          </div>

          {/* Title + meta */}
          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Pill icon={Icon.flask(11)}>Science</Pill>
              <Pill>Ages 6–9</Pill>
              <Pill icon={Icon.check(11, 'oklch(0.55 0.13 150)')}>Parent-approved</Pill>
            </div>
            <h1 className="t-h1" style={{ margin: 0 }}>Why Do Volcanoes Erupt?</h1>
            <div style={{
              marginTop: 6, fontSize: 14, fontWeight: 600, color: 'var(--kindi-ink-soft)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span>SciShow Kids</span>
              <span style={{ opacity: 0.5 }}>•</span>
              <Stars value={5}/>
              <span style={{ opacity: 0.5 }}>•</span>
              <span>2.3M views</span>
            </div>
          </div>
        </div>

        {/* Side rail */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Reflection card */}
          <div className="surface" style={{
            padding: 18, borderRadius: 18,
            background: 'linear-gradient(140deg, oklch(0.94 0.06 305), oklch(0.96 0.04 95))',
            border: '1px solid var(--kindi-line)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <KindiBlob color="var(--kindi-coral)" size={36} mood="wow"/>
              <div className="t-label">When you finish</div>
            </div>
            <div className="kindi-display" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.2, marginBottom: 10 }}>
              What's one new word you learned today?
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--kindi-ink-soft)', lineHeight: 1.5 }}>
              Tell mom or dad to earn a <b style={{ color: 'var(--kindi-ink)' }}>Curious Cookie</b> sticker for your shelf.
            </div>
          </div>

          {/* Up next (parent-approved only) */}
          <div className="surface" style={{ padding: 14, borderRadius: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div className="t-label">Up next</div>
              <span className="t-caption" style={{ color: 'var(--kindi-ink-soft)' }}>3 approved</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { t: 'What is Gravity? Explained', c: 'SciShow Kids', d: '3:45', g: 5 },
                { t: 'How Honeybees Make Honey',   c: 'Free School',  d: '6:30', g: 2 },
                { t: 'Animal Sounds Around World', c: 'Learning Tube',d: '4:20', g: 6 },
              ].map((v, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, cursor: 'pointer' }}>
                  <div style={{ width: 88, flexShrink: 0 }}>
                    <VideoThumb gradient={v.g} duration={v.d} h={56} radius={8}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.25,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{v.t}</div>
                    <div style={{ marginTop: 2, fontSize: 11.5, fontWeight: 600, color: 'var(--kindi-ink-soft)' }}>{v.c}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { KidPlayer });

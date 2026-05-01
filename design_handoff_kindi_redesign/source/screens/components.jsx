// Kindi shared atoms — polished v2.
// Real iconography, refined buttons, depth-based shadows.

// ─────────────────────────────────────────────────────────────
// KindiBlob — refined mascot. Same primitive base, better proportions.
// ─────────────────────────────────────────────────────────────
function KindiBlob({ color = 'var(--kindi-blush-mid)', size = 80, mood = 'happy', style = {} }) {
  const eye = (cx) => {
    if (mood === 'sleepy') return <path d={`M${cx-5} 0 Q${cx} 4 ${cx+5} 0`} stroke="#1f1c14" strokeWidth="2.4" strokeLinecap="round" fill="none"/>;
    if (mood === 'wow')    return <ellipse cx={cx} cy="-1" rx="3" ry="4" fill="#1f1c14"/>;
    if (mood === 'wink' && cx > 50) return <path d={`M${cx-5} 0 Q${cx} 4 ${cx+5} 0`} stroke="#1f1c14" strokeWidth="2.4" strokeLinecap="round" fill="none"/>;
    return <ellipse cx={cx} cy="0" rx="3.2" ry="3.6" fill="#1f1c14"/>;
  };
  const mouth = mood === 'wow'
    ? <ellipse cx="50" cy="64" rx="6" ry="7" fill="#1f1c14"/>
    : mood === 'sleepy'
    ? <path d="M44 62 Q50 65 56 62" stroke="#1f1c14" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
    : <path d="M41 56 Q50 67 59 56" stroke="#1f1c14" strokeWidth="2.6" strokeLinecap="round" fill="none"/>;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style}>
      <defs>
        <radialGradient id={`bg-${mood}-${size}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      <path d="M 50 6 C 80 6 92 28 92 52 C 92 78 76 94 50 94 C 24 94 8 78 8 52 C 8 28 20 6 50 6 Z"
        fill={color}/>
      <path d="M 50 6 C 80 6 92 28 92 52 C 92 78 76 94 50 94 C 24 94 8 78 8 52 C 8 28 20 6 50 6 Z"
        fill={`url(#bg-${mood}-${size})`}/>
      <ellipse cx="28" cy="60" rx="6" ry="4" fill="oklch(0.78 0.13 25 / 0.45)"/>
      <ellipse cx="72" cy="60" rx="6" ry="4" fill="oklch(0.78 0.13 25 / 0.45)"/>
      <g transform="translate(0 46)">{eye(38)}{eye(62)}</g>
      {mouth}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Logo
// ─────────────────────────────────────────────────────────────
function KindiLogo({ size = 22, dark = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.36 }}>
      <KindiBlob color="var(--kindi-coral)" size={size * 1.35}/>
      <span className="kindi-display" style={{
        fontSize: size * 1.55, fontWeight: 700, lineHeight: 1,
        color: dark ? 'var(--kindi-cream)' : 'var(--kindi-ink)',
        letterSpacing: '-0.045em',
      }}>kindi</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Button — premium feel: 1px border, layered shadow, hover lift.
// ─────────────────────────────────────────────────────────────
function Button({ children, variant = 'primary', size = 'md', onClick, style = {}, icon, iconRight, type = 'button' }) {
  const sz = size === 'lg' ? { p: '14px 22px', f: 15, r: 14, gap: 10 }
           : size === 'sm' ? { p: '7px 12px',  f: 12.5, r: 10, gap: 6 }
           : { p: '11px 18px', f: 14, r: 12, gap: 8 };

  const styles = {
    primary: {
      background: 'var(--kindi-primary)', color: 'var(--kindi-primary-fg)',
      boxShadow: '0 1px 0 rgba(255,255,255,0.2) inset, 0 1px 2px rgba(40,30,20,0.1), 0 4px 10px oklch(0.62 0.18 32 / 0.25)',
      border: '1px solid oklch(0.5 0.16 32)',
    },
    secondary: {
      background: 'var(--kindi-paper)', color: 'var(--kindi-ink)',
      boxShadow: '0 1px 2px rgba(40,30,20,0.04), 0 2px 4px rgba(40,30,20,0.04)',
      border: '1px solid var(--kindi-line-2)',
    },
    soft: {
      background: 'var(--kindi-cream-2)', color: 'var(--kindi-ink)',
      boxShadow: 'none', border: '1px solid transparent',
    },
    ghost: {
      background: 'transparent', color: 'var(--kindi-ink)',
      boxShadow: 'none', border: '1px solid transparent',
    },
    accent: {
      background: 'var(--kindi-ink)', color: 'var(--kindi-cream)',
      boxShadow: '0 1px 0 rgba(255,255,255,0.1) inset, 0 4px 12px rgba(40,30,20,0.25)',
      border: '1px solid var(--kindi-ink)',
    },
  };
  return (
    <button type={type} onClick={onClick} style={{
      padding: sz.p, borderRadius: sz.r, fontSize: sz.f, fontWeight: 700,
      fontFamily: 'var(--kindi-body)',
      display: 'inline-flex', alignItems: 'center', gap: sz.gap,
      transition: 'transform .12s, box-shadow .12s, background .12s',
      letterSpacing: '0.005em',
      ...styles[variant], ...style,
    }}>
      {icon}{children}{iconRight}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Pill / Chip / Badge
// ─────────────────────────────────────────────────────────────
function Pill({ children, color = 'var(--kindi-cream-2)', tone = 'soft', icon, style = {} }) {
  const isSoft = tone === 'soft';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 999,
      background: color,
      color: 'var(--kindi-ink)',
      border: isSoft ? '1px solid rgba(40,30,20,0.06)' : '1px solid var(--kindi-line)',
      fontFamily: 'var(--kindi-body)', fontSize: 11.5, fontWeight: 700,
      letterSpacing: '0.01em', whiteSpace: 'nowrap',
      ...style,
    }}>
      {icon}{children}
    </span>
  );
}

function Chip({ children, active = false, onClick, icon, style = {} }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 14px', borderRadius: 999,
      background: active ? 'var(--kindi-ink)' : 'var(--kindi-paper)',
      color: active ? 'var(--kindi-cream)' : 'var(--kindi-ink)',
      border: active ? '1px solid var(--kindi-ink)' : '1px solid var(--kindi-line-2)',
      boxShadow: active ? '0 4px 10px rgba(40,30,20,0.18)' : '0 1px 1px rgba(40,30,20,0.03)',
      fontFamily: 'var(--kindi-body)', fontSize: 13, fontWeight: 700,
      cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      transition: 'all .14s',
      ...style,
    }}>{icon}{children}</button>
  );
}

// ─────────────────────────────────────────────────────────────
// Thumbnail — composed "photographic" backdrop with depth
// ─────────────────────────────────────────────────────────────
function VideoThumb({
  topic, duration = '4:12', gradient = 1, h = 168, w = '100%',
  badge, progress, glyph, dim = false, radius = 14,
}) {
  return (
    <div className={`thumb-grad-${gradient} grain`} style={{
      position: 'relative', width: w, height: h, borderRadius: radius,
      overflow: 'hidden',
      boxShadow: '0 1px 2px rgba(40,30,20,0.06), 0 6px 16px rgba(40,30,20,0.10)',
      filter: dim ? 'saturate(0.75) brightness(0.95)' : 'none',
    }}>
      {/* Glyph: large abstract shape, no AI illustration */}
      {glyph && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0.4, mixBlendMode: 'soft-light',
        }}>{glyph}</div>
      )}

      {/* Top-left topic chip */}
      {topic && (
        <div style={{
          position: 'absolute', top: 10, left: 10,
          padding: '3px 9px', borderRadius: 999,
          background: 'rgba(255,255,255,0.92)',
          fontFamily: 'var(--kindi-body)', fontSize: 11, fontWeight: 800,
          color: 'var(--kindi-ink)', backdropFilter: 'blur(4px)',
          letterSpacing: '0.015em',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
        }}>{topic}</div>
      )}

      {/* Top-right badge */}
      {badge && (
        <div style={{ position: 'absolute', top: 10, right: 10 }}>{badge}</div>
      )}

      {/* Bottom gradient + duration */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 60,
        background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)',
        pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', bottom: 10, right: 10,
        padding: '3px 8px', borderRadius: 6,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        fontFamily: 'var(--kindi-mono)', fontSize: 11, fontWeight: 600,
        color: '#fff',
      }}>{duration}</div>

      {/* Progress bar */}
      {progress !== undefined && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: 3.5,
          background: 'rgba(255,255,255,0.25)',
        }}>
          <div style={{ width: `${progress*100}%`, height: '100%', background: 'oklch(0.78 0.16 30)' }}/>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stat card
// ─────────────────────────────────────────────────────────────
function StatCard({ label, value, delta, deltaTone = 'pos', style = {} }) {
  return (
    <div className="surface" style={{
      padding: '14px 16px', borderRadius: 14,
      background: 'var(--kindi-paper)',
      ...style,
    }}>
      <div className="t-label">{label}</div>
      <div className="kindi-display" style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.1, marginTop: 4, letterSpacing: '-0.02em' }}>
        {value}
      </div>
      {delta && (
        <div style={{
          marginTop: 6, fontSize: 12, fontWeight: 700,
          color: deltaTone === 'pos' ? 'oklch(0.55 0.13 150)' : 'var(--kindi-coral-deep)',
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          <span>{deltaTone === 'pos' ? '↑' : '↓'}</span> {delta}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Avatar
// ─────────────────────────────────────────────────────────────
function Avatar({ name, color = 'var(--kindi-mint-mid)', size = 44, mood = 'happy', ring = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, position: 'relative',
      boxShadow: ring ? `0 0 0 3px var(--kindi-paper), 0 0 0 5px var(--kindi-coral)` : '0 1px 2px rgba(40,30,20,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <KindiBlob color={color} size={size * 0.95} mood={mood}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stars
// ─────────────────────────────────────────────────────────────
function Stars({ value = 4, max = 5, size = 12 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1.5 }}>
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < value ? 'oklch(0.78 0.16 75)' : 'var(--kindi-line-2)'}>
          <path d="M12 2 L15 9 L22 9.5 L17 14.5 L18.5 22 L12 18 L5.5 22 L7 14.5 L2 9.5 L9 9 Z"/>
        </svg>
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Icon set — refined line icons. 1.6px stroke. 16px viewbox.
// ─────────────────────────────────────────────────────────────
const Icon = (() => {
  const I = (path, fill = false, sz = 16, sw = 1.6) => (s = 16, c = 'currentColor') => (
    <svg width={s} height={s} viewBox={`0 0 ${sz} ${sz}`} fill={fill ? c : 'none'} stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{path}</svg>
  );
  return {
    play:    I(<><path d="M5 3 L13 8 L5 13 Z" fill="currentColor"/></>, false),
    pause:   I(<><rect x="4" y="3" width="3" height="10" rx="1" fill="currentColor"/><rect x="9" y="3" width="3" height="10" rx="1" fill="currentColor"/></>, false),
    heart:   I(<path d="M8 13 C 3 9 1 6 3 4 C 5 2 7 3 8 4 C 9 3 11 2 13 4 C 15 6 13 9 8 13 Z" fill="currentColor"/>, false),
    star:    I(<path d="M8 2 L10 6.5 L15 7 L11 10.5 L12 15 L8 12.5 L4 15 L5 10.5 L1 7 L6 6.5 Z" fill="currentColor"/>, false),
    clock:   I(<><circle cx="8" cy="8" r="6"/><path d="M8 5 V 8 L 10 9.5"/></>),
    lock:    I(<><rect x="3.5" y="7" width="9" height="6.5" rx="1.5"/><path d="M5.5 7 V 5 a2.5 2.5 0 0 1 5 0 V 7"/></>),
    search:  I(<><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 L14 14"/></>),
    check:   I(<path d="M3 8 L6.5 11 L13 4.5"/>),
    plus:    I(<path d="M8 3 V 13 M3 8 H 13"/>),
    arrowR:  I(<path d="M3 8 H 13 M 9 4 L 13 8 L 9 12"/>),
    arrowL:  I(<path d="M13 8 H 3 M 7 4 L 3 8 L 7 12"/>),
    sparkle: I(<><path d="M8 1 L9 6 L14 7 L9 8 L8 13 L7 8 L2 7 L7 6 Z" fill="currentColor"/><circle cx="13" cy="3" r="0.8" fill="currentColor"/><circle cx="3" cy="13" r="0.6" fill="currentColor"/></>, false),
    bolt:    I(<path d="M9 1 L3 9 L7 9 L6 15 L13 7 L8 7 L9 1 Z" fill="currentColor"/>, false),
    book:    I(<><path d="M2 3 V 13 H 8 a3 3 0 0 1 3 -1 V 3 a3 3 0 0 0 -3 1 H 2 Z"/><path d="M8 4 V 12"/></>),
    flask:   I(<><path d="M6 2 H 10"/><path d="M6.5 2 V 6 L 3 12 a1 1 0 0 0 1 1.5 H 12 a1 1 0 0 0 1 -1.5 L 9.5 6 V 2"/></>),
    globe:   I(<><circle cx="8" cy="8" r="6"/><ellipse cx="8" cy="8" rx="3" ry="6"/><path d="M2 8 H 14"/></>),
    music:   I(<><path d="M6 11 V 4 L 13 3 V 10"/><circle cx="4.5" cy="11" r="2" fill="currentColor"/><circle cx="11" cy="10" r="2" fill="currentColor"/></>),
    paint:   I(<><circle cx="5" cy="6" r="1.5" fill="currentColor"/><circle cx="11" cy="6" r="1.5" fill="currentColor"/><circle cx="8" cy="11" r="1.5" fill="currentColor"/></>, false),
    parent:  I(<><circle cx="8" cy="6" r="2.5"/><path d="M3 13 a5 5 0 0 1 10 0"/></>),
    settings:I(<><circle cx="8" cy="8" r="2"/><path d="M8 2 L8.7 4 M8 14 L8.7 12 M14 8 L12 8 M2 8 L4 8 M12.2 3.8 L11 5 M3.8 12.2 L5 11 M12.2 12.2 L11 11 M3.8 3.8 L5 5"/></>),
    bell:    I(<><path d="M3 11 H 13 L 12 9 V 6 a4 4 0 0 0 -8 0 V 9 Z"/><path d="M6.5 13 a 1.5 1.5 0 0 0 3 0"/></>),
    shield:  I(<path d="M8 1 L 14 3 V 8 a 6 7 0 0 1 -6 7 a 6 7 0 0 1 -6 -7 V 3 Z"/>),
    grid:    I(<><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></>),
    list:    I(<><path d="M2 4 H 14 M2 8 H 14 M2 12 H 14"/></>),
    chevR:   I(<path d="M6 3 L 11 8 L 6 13"/>),
    chevD:   I(<path d="M3 6 L 8 11 L 13 6"/>),
    x:       I(<path d="M3 3 L 13 13 M 13 3 L 3 13"/>),
    moon:    I(<path d="M13 9 a 5 5 0 0 1 -7 -7 a 6 6 0 1 0 7 7 Z" fill="currentColor"/>),
    eye:     I(<><path d="M1 8 C 3 4 5 3 8 3 C 11 3 13 4 15 8 C 13 12 11 13 8 13 C 5 13 3 12 1 8 Z"/><circle cx="8" cy="8" r="2"/></>),
    user:    I(<><circle cx="8" cy="5.5" r="2.5"/><path d="M3 14 a 5 5 0 0 1 10 0"/></>),
    youtube: I(<><rect x="1.5" y="3" width="13" height="10" rx="2.5"/><path d="M7 6 L 11 8 L 7 10 Z" fill="currentColor"/></>, false),
    skip:    I(<><path d="M3 4 L 9 8 L 3 12 Z" fill="currentColor"/><rect x="10" y="4" width="2" height="8" rx="0.5" fill="currentColor"/></>, false),
    rewind:  I(<><path d="M13 4 L 7 8 L 13 12 Z" fill="currentColor"/><rect x="4" y="4" width="2" height="8" rx="0.5" fill="currentColor"/></>, false),
    home:    I(<path d="M2 8 L 8 2 L 14 8 V 14 H 10 V 10 H 6 V 14 H 2 Z"/>),
    folder:  I(<path d="M2 4 a 1 1 0 0 1 1 -1 H 6 L 8 5 H 13 a 1 1 0 0 1 1 1 V 12 a 1 1 0 0 1 -1 1 H 3 a 1 1 0 0 1 -1 -1 Z"/>),
    bookmark:I(<path d="M4 2 H 12 V 14 L 8 11 L 4 14 Z"/>),
    sun:     I(<><circle cx="8" cy="8" r="3"/><path d="M8 1 V 3 M8 13 V 15 M1 8 H 3 M13 8 H 15 M3 3 L 4.5 4.5 M11.5 11.5 L 13 13 M3 13 L 4.5 11.5 M11.5 4.5 L 13 3"/></>),
  };
})();

Object.assign(window, { KindiBlob, KindiLogo, Pill, Chip, Button, VideoThumb, Avatar, Stars, StatCard, Icon });

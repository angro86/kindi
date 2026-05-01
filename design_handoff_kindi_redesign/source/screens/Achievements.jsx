// Achievements — sticker collection page.

const STICKERS = [
  { name: 'Curious Cookie',  c: 'var(--kindi-coral)',     mood: 'wow',    unlocked: true,  rule: 'Watch 5 science videos' },
  { name: 'Story Sprout',    c: 'var(--kindi-mint-mid)',  mood: 'happy',  unlocked: true,  rule: 'Finish 10 stories' },
  { name: 'Big Word Wizard', c: 'var(--kindi-butter-mid)',mood: 'wink',   unlocked: true,  rule: 'Earn 100 stars' },
  { name: 'Maker Bee',       c: 'var(--kindi-lilac-mid)', mood: 'happy',  unlocked: true,  rule: 'Try 3 craft videos' },
  { name: 'Globe Trotter',   c: 'var(--kindi-sky-mid)',   mood: 'wow',    unlocked: false, rule: 'Visit 5 countries' },
  { name: 'Quiet Giant',     c: 'var(--kindi-mint-mid)',  mood: 'sleepy', unlocked: false, rule: 'Watch a bedtime story' },
  { name: 'Quiz Champ',      c: 'var(--kindi-coral)',     mood: 'wink',   unlocked: false, rule: 'Get 10 quizzes right' },
  { name: 'Early Bird',      c: 'var(--kindi-butter-mid)',mood: 'happy',  unlocked: false, rule: '7 morning sessions' },
];

function Achievements({ device = 'desktop' }) {
  const isMobile = device === 'mobile';
  const earned = STICKERS.filter(s => s.unlocked).length;
  return (
    <div className="kindi-body" style={{
      width: '100%', minHeight: '100%', background: 'var(--kindi-cream)',
      padding: isMobile ? '20px 18px 36px' : '28px 40px 48px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <Button variant="secondary" size="sm" icon={Icon.arrowL(13)}>Back</Button>
        <h1 className="t-h1" style={{ margin: 0 }}>My <span className="squig">stickers</span></h1>
      </div>

      {/* Star header */}
      <div style={{
        padding: 22, borderRadius: 22,
        background: 'linear-gradient(140deg, oklch(0.94 0.07 90), oklch(0.92 0.08 35))',
        display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24,
        border: '1px solid var(--kindi-line)',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 999,
          background: 'var(--kindi-paper)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-md)',
        }}>{Icon.star(40, 'oklch(0.78 0.16 75)')}</div>
        <div style={{ flex: 1 }}>
          <div className="t-label">Total stars</div>
          <div className="kindi-display" style={{ fontSize: isMobile ? 36 : 48, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1 }}>
            126 ⭐
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--kindi-ink-soft)', marginTop: 2 }}>
            {earned} of {STICKERS.length} stickers earned · 4 stars to next
          </div>
        </div>
      </div>

      {/* Sticker grid */}
      <h3 className="t-h3" style={{ marginBottom: 12 }}>Sticker shelf</h3>
      <div style={{
        display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
        gap: 14,
      }}>
        {STICKERS.map(s => (
          <div key={s.name} style={{
            padding: 18, borderRadius: 18,
            background: s.unlocked ? 'var(--kindi-paper)' : 'var(--kindi-cream-2)',
            border: s.unlocked ? '1px solid var(--kindi-line)' : '1px dashed var(--kindi-line-2)',
            boxShadow: s.unlocked ? 'var(--shadow-sm)' : 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            textAlign: 'center',
            opacity: s.unlocked ? 1 : 0.55,
            position: 'relative',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: s.c, display: 'flex', alignItems: 'center', justifyContent: 'center',
              filter: s.unlocked ? 'none' : 'grayscale(0.8)',
              boxShadow: s.unlocked ? '0 6px 16px rgba(40,30,20,0.12)' : 'none',
            }}>
              <KindiBlob color={s.c} size={80} mood={s.mood}/>
            </div>
            {!s.unlocked && (
              <div style={{
                position: 'absolute', top: 14, right: 14,
                width: 26, height: 26, borderRadius: 999,
                background: 'var(--kindi-cream-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{Icon.lock(12, 'var(--kindi-ink-soft)')}</div>
            )}
            <div className="kindi-display" style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em' }}>{s.name}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--kindi-ink-soft)', lineHeight: 1.4 }}>{s.rule}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Achievements });

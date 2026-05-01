// Quiz — overlay that appears every ~3 min during video. Single multiple-choice Q.
// Plus QuizResult screen (stars rewarded).

const SAMPLE_Q = {
  topic: 'Volcano time-out',
  prompt: 'What makes a volcano erupt?',
  options: [
    { label: 'Hot liquid rock pushing up from deep underground', correct: true },
    { label: 'Wind blowing across the top of the mountain' },
    { label: 'Rain getting trapped inside it' },
    { label: 'The mountain getting too tall' },
  ],
};

function Quiz({ device = 'desktop', state = 'asking' }) {
  const isMobile = device === 'mobile';
  const [picked, setPicked] = React.useState(state === 'answered' ? 0 : null);
  const showFeedback = picked !== null;

  return (
    <div className="kindi-body" style={{
      width: '100%', minHeight: '100%',
      background: 'rgba(20,15,10,0.55)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? 16 : 32,
    }}>
      <div className="surface" style={{
        width: '100%', maxWidth: isMobile ? '100%' : 560,
        background: 'var(--kindi-cream)',
        borderRadius: 24, padding: isMobile ? 22 : 32,
        boxShadow: 'var(--shadow-xl)', border: '1px solid var(--kindi-line)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <KindiBlob color="var(--kindi-butter-mid)" size={48} mood="wow"/>
          <div style={{ flex: 1 }}>
            <div className="t-label">Quick quiz · {SAMPLE_Q.topic}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--kindi-ink-soft)' }}>3 min watched · 2 stars to earn</div>
          </div>
          <Pill color="oklch(0.92 0.13 90)" tone="soft" icon={Icon.star(11, 'oklch(0.78 0.16 75)')}>+2</Pill>
        </div>

        {/* Prompt */}
        <h2 className="kindi-display" style={{
          margin: 0, fontSize: isMobile ? 24 : 30, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.15,
        }}>
          {SAMPLE_Q.prompt}
        </h2>

        {/* Options */}
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SAMPLE_Q.options.map((o, i) => {
            const isPicked = picked === i;
            const isCorrect = o.correct;
            const reveal = showFeedback;
            const bg = !reveal ? 'var(--kindi-paper)'
              : isCorrect ? 'oklch(0.92 0.10 150)'
              : isPicked ? 'oklch(0.92 0.08 30)'
              : 'var(--kindi-paper)';
            const border = !reveal ? 'var(--kindi-line-2)'
              : isCorrect ? 'oklch(0.55 0.15 150)'
              : isPicked ? 'var(--kindi-coral-deep)'
              : 'var(--kindi-line-2)';
            return (
              <button key={i} onClick={() => setPicked(i)} style={{
                padding: '14px 16px', borderRadius: 14,
                background: bg, border: `2px solid ${border}`,
                fontSize: 14.5, fontWeight: 700, color: 'var(--kindi-ink)',
                textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 12,
                boxShadow: reveal && isCorrect ? '0 4px 14px oklch(0.6 0.13 150 / 0.3)' : 'var(--shadow-xs)',
                cursor: 'pointer',
              }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 999, flexShrink: 0,
                  background: !reveal ? 'var(--kindi-cream-3)' : isCorrect ? 'oklch(0.55 0.15 150)' : isPicked ? 'var(--kindi-coral-deep)' : 'var(--kindi-cream-3)',
                  color: !reveal ? 'var(--kindi-ink)' : (isCorrect || isPicked) ? '#fff' : 'var(--kindi-ink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800, fontFamily: 'var(--kindi-display)',
                }}>
                  {reveal && isCorrect ? Icon.check(14, '#fff')
                    : reveal && isPicked ? Icon.x(12, '#fff')
                    : String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex: 1, lineHeight: 1.35 }}>{o.label}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div style={{
            marginTop: 18, padding: 14, borderRadius: 12,
            background: 'oklch(0.95 0.05 95)', border: '1px solid oklch(0.85 0.10 90)',
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            {Icon.sparkle(18, 'oklch(0.62 0.18 75)')}
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5, color: 'var(--kindi-ink)' }}>
              <b>That hot liquid rock is called <i>magma</i>.</b> When it pushes through cracks in Earth's crust, it becomes <i>lava</i> — and that's an eruption!
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
          <button style={{ background: 'transparent', border: 'none', fontSize: 13, fontWeight: 700, color: 'var(--kindi-ink-soft)', cursor: 'pointer' }}>
            Skip
          </button>
          <Button variant="primary" size="lg" iconRight={Icon.arrowR(14, '#fff')}>
            {showFeedback ? 'Keep watching' : 'Lock in'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function QuizResult({ device = 'desktop' }) {
  const isMobile = device === 'mobile';
  return (
    <div className="kindi-body" style={{
      width: '100%', minHeight: '100%',
      background: 'linear-gradient(160deg, oklch(0.92 0.07 90) 0%, oklch(0.88 0.10 35) 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? '36px 18px' : '64px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      {/* Confetti dots */}
      {Array.from({ length: 24 }).map((_, i) => {
        const colors = ['var(--kindi-coral)', 'var(--kindi-mint-mid)', 'var(--kindi-butter-mid)', 'var(--kindi-lilac-mid)', 'var(--kindi-sky-mid)'];
        return <div key={i} style={{
          position: 'absolute',
          top: `${(i*37) % 90}%`, left: `${(i*53) % 100}%`,
          width: 8 + (i%3)*4, height: 8 + (i%3)*4, borderRadius: i%2 ? 999 : 2,
          background: colors[i % 5], opacity: 0.65,
          transform: `rotate(${i*23}deg)`,
        }}/>;
      })}

      <div style={{ position: 'relative', zIndex: 2 }}>
        <KindiBlob color="var(--kindi-coral)" size={isMobile ? 96 : 128} mood="wow"/>
        <div className="t-label" style={{ marginTop: 22 }}>Nice work, Mila</div>
        <h1 className="kindi-display" style={{
          margin: '6px 0 14px', fontSize: isMobile ? 44 : 64, fontWeight: 600, letterSpacing: '-0.035em',
        }}>
          You got it <span className="squig">right!</span>
        </h1>

        {/* Star burst */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 24px', borderRadius: 999,
          background: 'var(--kindi-paper)', boxShadow: 'var(--shadow-md)',
        }}>
          {Icon.star(28, 'oklch(0.78 0.16 75)')}
          <span className="kindi-display" style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em' }}>+2 stars</span>
        </div>

        <div style={{ marginTop: 24, fontSize: 14, fontWeight: 600, color: 'var(--kindi-ink-soft)' }}>
          You now have <b style={{ color: 'var(--kindi-ink)' }}>126 stars</b> · 4 more to unlock the <i>Curious Cookie</i> sticker
        </div>

        {/* Mini progress to next */}
        <div style={{ marginTop: 16, width: 280, margin: '16px auto 0' }}>
          <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.6)', overflow: 'hidden' }}>
            <div style={{ width: '93%', height: '100%', background: 'oklch(0.78 0.16 75)' }}/>
          </div>
          <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: 'var(--kindi-ink-soft)' }}>
            <span>126</span><span>130 to unlock</span>
          </div>
        </div>

        <div style={{ marginTop: 28, display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Button variant="secondary" size="lg">See stickers</Button>
          <Button variant="primary" size="lg" icon={Icon.play(13, '#fff')}>Keep watching</Button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Quiz, QuizResult });

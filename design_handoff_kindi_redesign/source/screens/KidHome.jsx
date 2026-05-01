// KidHome — polished v2.
// Magazine-style layout: hero feature row + side-scrolling shelves (like a real streaming service)
// + grid of categories. Real photographic-feeling thumbnails. Refined hierarchy.

const TOPICS = [
  { id: 'all',     label: 'For you' },
  { id: 'science', label: 'Science' },
  { id: 'world',   label: 'World' },
  { id: 'art',     label: 'Make' },
  { id: 'stories', label: 'Stories' },
  { id: 'music',   label: 'Music' },
  { id: 'nature',  label: 'Nature' },
];

// Glyph shapes — abstract, no AI illustration
const Glyph = {
  volcano: (s = 200) => <svg width={s} height={s} viewBox="0 0 100 100" fill="rgba(255,255,255,0.5)"><path d="M30 80 L45 30 L55 30 L70 80 Z" stroke="rgba(255,255,255,0.8)" strokeWidth="1" fill="none"/><circle cx="50" cy="28" r="6" fill="rgba(255,255,255,0.6)"/></svg>,
  globe:   (s = 200) => <svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1"><circle cx="50" cy="50" r="34"/><ellipse cx="50" cy="50" rx="14" ry="34"/><path d="M16 50 H 84"/><path d="M22 32 H 78 M22 68 H 78"/></svg>,
  fox:     (s = 200) => <svg width={s} height={s} viewBox="0 0 100 100" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" fill="none"><path d="M30 60 L25 35 L45 50 L55 50 L75 35 L70 60 Z"/><circle cx="42" cy="55" r="2" fill="rgba(255,255,255,0.7)"/><circle cx="58" cy="55" r="2" fill="rgba(255,255,255,0.7)"/></svg>,
  turtle:  (s = 200) => <svg width={s} height={s} viewBox="0 0 100 100" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" fill="none"><ellipse cx="50" cy="55" rx="24" ry="18"/><path d="M50 37 L50 73 M30 50 L70 50 M34 42 L66 42 M34 68 L66 68"/><circle cx="78" cy="50" r="6"/></svg>,
  atom:    (s = 200) => <svg width={s} height={s} viewBox="0 0 100 100" stroke="rgba(255,255,255,0.55)" strokeWidth="1" fill="none"><ellipse cx="50" cy="50" rx="32" ry="14"/><ellipse cx="50" cy="50" rx="32" ry="14" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="32" ry="14" transform="rotate(-60 50 50)"/><circle cx="50" cy="50" r="3" fill="rgba(255,255,255,0.7)"/></svg>,
  music:   (s = 200) => <svg width={s} height={s} viewBox="0 0 100 100" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" fill="none"><circle cx="35" cy="68" r="8" fill="rgba(255,255,255,0.45)"/><circle cx="68" cy="60" r="8" fill="rgba(255,255,255,0.45)"/><path d="M43 68 V 30 L 76 24 V 60"/></svg>,
  origami: (s = 200) => <svg width={s} height={s} viewBox="0 0 100 100" stroke="rgba(255,255,255,0.55)" strokeWidth="1" fill="none"><path d="M20 70 L 50 30 L 80 70 L 50 60 Z"/><path d="M50 30 L 50 60 M 30 65 L 50 60 M 70 65 L 50 60"/></svg>,
};

const VIDEOS = [
  { title: 'Why Do Volcanoes Erupt?',         creator: 'SciShow Kids',           dur: '4:12', topic: 'Science', cat: 'science', g: 1, glyph: Glyph.volcano, stars: 5, picked: true, age: '6–9' },
  { title: 'A Day in Ancient Egypt',          creator: 'Mr. Beat',               dur: '6:08', topic: 'History', cat: 'world',   g: 3, glyph: Glyph.globe,   stars: 4, age: '7–11' },
  { title: 'How to Draw a Fox, Step by Step', creator: 'Art for Kids Hub',       dur: '8:34', topic: 'Make',    cat: 'art',     g: 7, glyph: Glyph.fox,     stars: 5, age: '5+' },
  { title: 'The Tiny Tortoise Tale',          creator: 'Storyline Online',       dur: '5:50', topic: 'Stories', cat: 'stories', g: 2, glyph: Glyph.turtle,  stars: 4, age: '3–7' },
  { title: 'What is Gravity? Explained',      creator: 'SciShow Kids',           dur: '3:45', topic: 'Science', cat: 'science', g: 5, glyph: Glyph.atom,    stars: 5, age: '8+' },
  { title: 'Songs From Around the World',     creator: 'Putumayo Kids',          dur: '5:10', topic: 'Music',   cat: 'music',   g: 4, glyph: Glyph.music,   stars: 4, age: '4+' },
  { title: 'Origami Crane, Step by Step',     creator: 'Easy Origami',           dur: '7:02', topic: 'Make',    cat: 'art',     g: 8, glyph: Glyph.origami, stars: 4, age: '6+' },
  { title: 'Animal Sounds Around the World',  creator: 'Kids Learning Tube',     dur: '4:20', topic: 'Nature',  cat: 'nature',  g: 6, glyph: Glyph.fox,     stars: 4, age: '3–7' },
  { title: 'How Honeybees Make Honey',        creator: 'Free School',            dur: '6:30', topic: 'Nature',  cat: 'nature',  g: 2, glyph: Glyph.atom,    stars: 5, age: '5+' },
];

function KidHome({ device = 'desktop' }) {
  const [topic, setTopic] = React.useState('all');
  const isMobile = device === 'mobile';
  const filtered = topic === 'all' ? VIDEOS : VIDEOS.filter(v => v.cat === topic);

  return (
    <div className="kindi-body" style={{
      width: '100%', minHeight: '100%', background: 'var(--kindi-cream)',
      paddingBottom: 48,
    }}>
      <KidHeader isMobile={isMobile}/>
      <KidTopicBar topic={topic} setTopic={setTopic} isMobile={isMobile}/>

      {/* Hero */}
      <div style={{ padding: isMobile ? '0 18px 8px' : '8px 40px 16px' }}>
        <KidHero isMobile={isMobile}/>
      </div>

      {/* Continue watching shelf */}
      <Shelf
        title="Pick up where you left off"
        subtitle="2 unfinished videos"
        isMobile={isMobile}
      >
        <ContinueCard {...VIDEOS[0]} progress={0.62} isMobile={isMobile}/>
        <ContinueCard {...VIDEOS[3]} progress={0.28} isMobile={isMobile}/>
        <ContinueCard {...VIDEOS[2]} progress={0.85} isMobile={isMobile}/>
      </Shelf>

      {/* Today's pick — large featured row */}
      <Shelf
        title="Today's parent picks"
        subtitle="3 hand-picked just for Mila"
        isMobile={isMobile}
        accent
      >
        {filtered.slice(0, 3).map((v, i) => (
          <FeatureCard key={i} {...v} isMobile={isMobile}/>
        ))}
      </Shelf>

      {/* Topic shelves */}
      <Shelf title="Science" subtitle="Curious experiments and big questions" isMobile={isMobile}>
        {VIDEOS.filter(v => v.cat === 'science').map((v, i) => <ThumbCard key={i} {...v} isMobile={isMobile}/>)}
      </Shelf>

      <Shelf title="Stories & make" subtitle="Slow-paced and hands-on" isMobile={isMobile}>
        {[...VIDEOS.filter(v => v.cat === 'stories'), ...VIDEOS.filter(v => v.cat === 'art')].map((v, i) => <ThumbCard key={i} {...v} isMobile={isMobile}/>)}
      </Shelf>
    </div>
  );
}

function KidHeader({ isMobile }) {
  return (
    <div style={{
      padding: isMobile ? '20px 18px 12px' : '24px 40px 14px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Avatar color="var(--kindi-coral)" size={isMobile ? 44 : 52} mood="happy"/>
        <div>
          <div className="t-label">Tuesday afternoon</div>
          <div className="kindi-display" style={{
            fontSize: isMobile ? 24 : 32, fontWeight: 600, lineHeight: 1.05, letterSpacing: '-0.025em',
          }}>
            Hi, <span className="squig">Mila</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 14px', borderRadius: 999,
          background: 'var(--kindi-paper)', border: '1px solid var(--kindi-line-2)',
          boxShadow: 'var(--shadow-xs)',
        }}>
          {Icon.clock(15, 'var(--kindi-coral-deep)')}
          <span className="t-mono" style={{ fontWeight: 700, fontSize: 13 }}>18 min left</span>
        </div>
        {!isMobile && (
          <button style={{
            width: 40, height: 40, borderRadius: 999,
            background: 'var(--kindi-paper)', border: '1px solid var(--kindi-line-2)',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icon.lock(16, 'var(--kindi-ink-soft)')}</button>
        )}
      </div>
    </div>
  );
}

function KidTopicBar({ topic, setTopic, isMobile }) {
  return (
    <div style={{
      padding: isMobile ? '4px 18px 16px' : '8px 40px 20px',
      display: 'flex', gap: 8, overflowX: 'auto',
    }} className="no-scrollbar">
      {TOPICS.map(t => (
        <Chip key={t.id} active={topic === t.id} onClick={() => setTopic(t.id)}>
          {t.label}
        </Chip>
      ))}
    </div>
  );
}

function KidHero({ isMobile }) {
  const v = VIDEOS[0];
  return (
    <div style={{
      position: 'relative', borderRadius: 24, overflow: 'hidden',
      height: isMobile ? 240 : 360,
      boxShadow: 'var(--shadow-lg)',
    }} className="thumb-grad-1 grain">
      <div style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>{Glyph.volcano(isMobile ? 200 : 360)}</div>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
      }}/>
      <div style={{
        position: 'absolute', top: isMobile ? 14 : 20, left: isMobile ? 14 : 20,
        display: 'flex', gap: 6, alignItems: 'center',
      }}>
        <Pill color="rgba(255,255,255,0.95)" tone="soft" icon={Icon.sparkle(11, 'var(--kindi-coral-deep)')}>
          Featured today
        </Pill>
        <Pill color="rgba(255,255,255,0.95)" tone="soft">{v.topic}</Pill>
      </div>
      <div style={{
        position: 'absolute', left: isMobile ? 18 : 32, right: isMobile ? 18 : 32, bottom: isMobile ? 18 : 28,
        color: '#fff',
      }}>
        <h2 className="kindi-display" style={{
          margin: 0, fontSize: isMobile ? 26 : 44, fontWeight: 600, lineHeight: 1.05,
          letterSpacing: '-0.025em', textShadow: '0 2px 8px rgba(0,0,0,0.25)',
          maxWidth: 540,
        }}>{v.title}</h2>
        <div style={{
          marginTop: 8, display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, fontWeight: 600,
          opacity: 0.9,
        }}>
          <span>{v.creator}</span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span style={{ fontFamily: 'var(--kindi-mono)' }}>{v.dur}</span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span>Ages {v.age}</span>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <Button variant="primary" size={isMobile ? 'md' : 'lg'} icon={Icon.play(14, '#fff')}>
            Watch now
          </Button>
          <button style={{
            padding: isMobile ? '11px 14px' : '14px 18px', borderRadius: 12,
            background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', fontWeight: 700, fontSize: 14,
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            {Icon.bookmark(14, '#fff')} Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Shelf({ title, subtitle, accent, children, isMobile }) {
  return (
    <section style={{
      padding: isMobile ? '20px 0 8px' : '28px 0 12px',
    }}>
      <div style={{
        padding: isMobile ? '0 18px 12px' : '0 40px 16px',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12,
      }}>
        <div>
          <h3 className="kindi-display" style={{ margin: 0, fontSize: isMobile ? 20 : 26, fontWeight: 600, letterSpacing: '-0.022em' }}>
            {title}
          </h3>
          {subtitle && <div style={{ marginTop: 2, fontSize: 13, fontWeight: 600, color: 'var(--kindi-ink-soft)' }}>{subtitle}</div>}
        </div>
        {!isMobile && (
          <button style={{
            padding: '6px 10px', borderRadius: 8, background: 'transparent', border: 'none',
            fontSize: 13, fontWeight: 700, color: 'var(--kindi-ink-soft)',
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>See all {Icon.chevR(12)}</button>
        )}
      </div>
      <div style={{
        display: 'flex', gap: 14, overflowX: 'auto',
        padding: isMobile ? '0 18px 8px' : '0 40px 12px',
        scrollSnapType: 'x mandatory',
      }} className="no-scrollbar">
        {children}
      </div>
    </section>
  );
}

function FeatureCard({ title, creator, dur, topic, g, glyph, stars, age, picked, isMobile }) {
  const w = isMobile ? 260 : 320;
  return (
    <div style={{
      flex: `0 0 ${w}px`, scrollSnapAlign: 'start',
      display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer',
    }} className="ring">
      <VideoThumb
        gradient={g} duration={dur} topic={topic} h={isMobile ? 156 : 200}
        glyph={glyph(isMobile ? 180 : 240)}
        badge={picked ? <Pill color="oklch(0.92 0.13 90)" tone="soft" icon={Icon.sparkle(10, 'var(--kindi-coral-deep)')}>Pick of the day</Pill> : null}
      />
      <div style={{ padding: '0 2px' }}>
        <div className="t-h3" style={{ margin: 0, textWrap: 'pretty' }}>{title}</div>
        <div style={{
          marginTop: 5, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between',
          fontSize: 12.5, fontWeight: 600, color: 'var(--kindi-ink-soft)',
        }}>
          <span>{creator}</span>
          <Stars value={stars}/>
        </div>
        <div style={{
          marginTop: 6, display: 'flex', gap: 6,
        }}>
          <Pill>{age}</Pill>
          <Pill tone="soft">{topic}</Pill>
        </div>
      </div>
    </div>
  );
}

function ThumbCard({ title, creator, dur, topic, g, glyph, stars, isMobile }) {
  const w = isMobile ? 200 : 240;
  return (
    <div style={{
      flex: `0 0 ${w}px`, scrollSnapAlign: 'start',
      display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer',
    }} className="ring">
      <VideoThumb
        gradient={g} duration={dur} topic={topic} h={isMobile ? 116 : 138}
        glyph={glyph(isMobile ? 130 : 160)}
      />
      <div style={{ padding: '0 2px' }}>
        <div style={{
          fontSize: 14, fontWeight: 700, lineHeight: 1.3, color: 'var(--kindi-ink)',
          textWrap: 'pretty',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          minHeight: 36,
        }}>{title}</div>
        <div style={{
          marginTop: 4, fontSize: 12, fontWeight: 600, color: 'var(--kindi-ink-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{creator}</span>
          <span className="t-mono" style={{ fontSize: 11 }}>{dur}</span>
        </div>
      </div>
    </div>
  );
}

function ContinueCard({ title, creator, dur, topic, g, glyph, progress, isMobile }) {
  const w = isMobile ? 240 : 280;
  return (
    <div style={{
      flex: `0 0 ${w}px`, scrollSnapAlign: 'start',
      display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer',
    }} className="ring">
      <VideoThumb
        gradient={g} duration={dur} h={isMobile ? 130 : 158} topic={topic}
        glyph={glyph(isMobile ? 150 : 180)}
        progress={progress}
        badge={<div style={{
          padding: '4px 8px', borderRadius: 6,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
          color: '#fff', fontFamily: 'var(--kindi-mono)', fontSize: 11, fontWeight: 700,
        }}>{Math.round((1-progress) * parseFloat(dur))} min left</div>}
      />
      <div style={{ padding: '0 2px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3, textWrap: 'pretty',
          display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{title}</div>
        <div style={{ marginTop: 3, fontSize: 12, fontWeight: 600, color: 'var(--kindi-ink-soft)' }}>{creator}</div>
      </div>
    </div>
  );
}

Object.assign(window, { KidHome });

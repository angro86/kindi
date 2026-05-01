// ParentDashboard — polished v2.

const KIDS = [
  { name: 'Mila',  color: 'var(--kindi-coral)',   age: 7, mood: 'happy', mins: 32, cap: 60, top: 'Science' },
  { name: 'Theo',  color: 'var(--kindi-mint-mid)',age: 5, mood: 'wow',   mins: 18, cap: 45, top: 'Stories' },
];

const PENDING = [
  { title: 'How Rockets Land Themselves',     creator: 'Veritasium',           dur: '11:40', why: 'Mila searched "rockets"',     g: 5, age: '9+' },
  { title: 'Bake Bread With Grandma',         creator: 'Tasty Kids',           dur: '6:22',  why: 'From an approved channel',     g: 7, age: '5+' },
  { title: 'Why Cats Purr',                    creator: "It's Okay To Be Smart",dur: '5:12', why: 'Suggested for Theo',           g: 4, age: '4+' },
];

function ParentDashboard({ device = 'desktop' }) {
  const [tab, setTab] = React.useState('overview');
  const isMobile = device === 'mobile';

  return (
    <div className="kindi-body" style={{
      width: '100%', minHeight: '100%', background: 'var(--kindi-cream)',
      paddingBottom: 48,
    }}>
      {/* Top app bar */}
      <div style={{
        padding: isMobile ? '16px 18px' : '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--kindi-line)',
        background: 'rgba(253,250,244,0.85)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <KindiLogo size={isMobile ? 18 : 20}/>
          {!isMobile && (
            <nav style={{ display: 'flex', gap: 4 }}>
              {[['overview','Overview'],['queue','Approve queue'],['library','Library'],['limits','Limits'],['kids','Kids']].map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)} style={{
                  padding: '7px 14px', borderRadius: 9, border: 'none',
                  background: tab === id ? 'var(--kindi-cream-3)' : 'transparent',
                  color: tab === id ? 'var(--kindi-ink)' : 'var(--kindi-ink-soft)',
                  fontSize: 13.5, fontWeight: 700,
                }}>{label}{id === 'queue' && <span style={{
                  marginLeft: 6, padding: '1px 6px', borderRadius: 999, background: 'var(--kindi-coral)',
                  color: '#fff', fontSize: 11, fontWeight: 800,
                }}>{PENDING.length}</span>}</button>
              ))}
            </nav>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!isMobile && (
            <button style={{
              width: 38, height: 38, borderRadius: 10, background: 'transparent',
              border: '1px solid var(--kindi-line-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{Icon.bell(16, 'var(--kindi-ink-soft)')}</button>
          )}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 5px 5px 12px',
            borderRadius: 999, border: '1px solid var(--kindi-line-2)', background: 'var(--kindi-paper)',
          }}>
            {!isMobile && <span style={{ fontSize: 13, fontWeight: 700 }}>Sam</span>}
            <div style={{
              width: 30, height: 30, borderRadius: 999,
              background: 'linear-gradient(135deg, var(--kindi-coral), oklch(0.6 0.16 30))',
              color: '#fff', fontFamily: 'var(--kindi-display)', fontWeight: 700, fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>S</div>
          </div>
        </div>
      </div>

      <div style={{ padding: isMobile ? '20px 18px 0' : '32px 32px 0', maxWidth: 1280, margin: '0 auto' }}>
        {/* Headline */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div className="t-label">Tuesday, April 30</div>
            <h1 className="t-display" style={{ margin: '4px 0 6px' }}>
              Today's <span className="squig">looking good.</span>
            </h1>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--kindi-ink-soft)', maxWidth: 580 }}>
              50 minutes of screen time across 2 kids — 84% on educational categories you picked.
            </p>
          </div>
          {!isMobile && <Button variant="primary" icon={Icon.plus(13, '#fff')}>Add a video</Button>}
        </div>

        {/* Mobile tabs */}
        {isMobile && (
          <div style={{ display: 'flex', gap: 6, marginTop: 18, overflowX: 'auto' }} className="no-scrollbar">
            {[['overview','Overview'],['queue',`Approve · ${PENDING.length}`],['library','Library'],['limits','Limits'],['kids','Kids']].map(([id, label]) => (
              <Chip key={id} active={tab === id} onClick={() => setTab(id)}>{label}</Chip>
            ))}
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          {tab === 'overview' && <Overview isMobile={isMobile}/>}
          {tab === 'queue'    && <ApproveQueue isMobile={isMobile}/>}
          {tab === 'library'  && <Library isMobile={isMobile}/>}
          {tab === 'limits'   && <Limits isMobile={isMobile}/>}
          {tab === 'kids'     && <KidsTab isMobile={isMobile}/>}
        </div>
      </div>
    </div>
  );
}

function Overview({ isMobile }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr', gap: 16 }}>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, gridColumn: isMobile ? '1' : '1 / -1' }}>
        <StatCard label="Watched today" value="50m" delta="12% vs avg"/>
        <StatCard label="Educational" value="84%" delta="6 pts" />
        <StatCard label="Approved videos" value="64" delta="3 new"/>
        <StatCard label="Pending" value={PENDING.length.toString()} delta="needs review" deltaTone="neg"/>
      </div>

      {/* Kids panel */}
      <Panel title="Kids today" right={<Button variant="ghost" size="sm" iconRight={Icon.chevR(12)}>All kids</Button>}>
        {KIDS.map(k => <KidRow key={k.name} {...k}/>)}
      </Panel>

      {/* Activity chart */}
      <Panel title="Last 7 days" right={<Pill>Educational time</Pill>}>
        <Bars/>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--kindi-line)',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
        }}>
          <Mini label="Avg session"  value="14 min"/>
          <Mini label="Top topic"    value="Science"/>
          <Mini label="Total"        value="5h 12m"/>
          <Mini label="Bedtime hits" value="0"/>
        </div>
      </Panel>

      {/* Quick controls */}
      <Panel title="Quick controls" style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { i: Icon.youtube,  l: 'Add by URL',     d: 'Paste a YouTube link' },
            { i: Icon.search,   l: 'Find a channel', d: 'Browse approved' },
            { i: Icon.lock,     l: 'Pause all',      d: 'Stop screens now' },
            { i: Icon.moon,     l: 'Bedtime mode',   d: 'Lock until 7am' },
          ].map((a, i) => (
            <button key={i} style={{
              padding: 14, borderRadius: 14, background: 'var(--kindi-paper)',
              border: '1px solid var(--kindi-line)', textAlign: 'left',
              boxShadow: 'var(--shadow-xs)',
              display: 'flex', flexDirection: 'column', gap: 8,
              cursor: 'pointer',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'var(--kindi-cream-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{a.i(16, 'var(--kindi-ink)')}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{a.l}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--kindi-ink-soft)' }}>{a.d}</div>
              </div>
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Panel({ title, right, children, style = {} }) {
  return (
    <div className="surface" style={{ padding: 20, borderRadius: 18, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 className="t-h3">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div>
      <div className="t-label">{label}</div>
      <div className="kindi-display" style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function KidRow({ name, color, age, mood, mins, cap, top }) {
  const pct = Math.min(1, mins / cap);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--kindi-line)' }}>
      <Avatar color={color} size={44} mood={mood}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 800 }}>
            {name} <span style={{ color: 'var(--kindi-ink-mute)', fontWeight: 600, fontSize: 12 }}>· {age} yrs · loves {top}</span>
          </div>
          <div className="t-mono" style={{ fontWeight: 700, fontSize: 12 }}>{mins}/{cap} min</div>
        </div>
        <div style={{ height: 6, marginTop: 6, borderRadius: 3, background: 'var(--kindi-cream-3)', overflow: 'hidden' }}>
          <div style={{ width: `${pct*100}%`, height: '100%', background: pct > 0.85 ? 'var(--kindi-coral-deep)' : 'oklch(0.55 0.13 150)', borderRadius: 3 }}/>
        </div>
      </div>
      <button style={{
        width: 32, height: 32, borderRadius: 8, background: 'transparent', border: '1px solid var(--kindi-line-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{Icon.chevR(14, 'var(--kindi-ink-soft)')}</button>
    </div>
  );
}

function Bars() {
  const days = [['Mon', 28, 22], ['Tue', 42, 36], ['Wed', 35, 28], ['Thu', 18, 16], ['Fri', 55, 42], ['Sat', 72, 50], ['Sun', 48, 38]];
  const max = 80;
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 130 }}>
      {days.map(([d, total, edu], i) => (
        <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: '100%', height: `${(total/max)*100}%`, minHeight: 4,
            position: 'relative', background: 'var(--kindi-cream-3)', borderRadius: 6,
            display: 'flex', flexDirection: 'column-reverse',
          }}>
            <div style={{
              width: '100%', height: `${(edu/total)*100}%`,
              background: i === 5 ? 'var(--kindi-coral-deep)' : 'oklch(0.6 0.13 150)',
              borderRadius: 6,
            }}/>
          </div>
          <div className="t-mono" style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--kindi-ink-soft)' }}>{d}</div>
        </div>
      ))}
    </div>
  );
}

function ApproveQueue({ isMobile }) {
  return (
    <Panel title={`Awaiting your review · ${PENDING.length}`}
      right={<Button variant="ghost" size="sm">Approve all safe</Button>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PENDING.map((v, i) => (
          <div key={i} style={{
            display: 'flex', gap: 14, alignItems: 'center',
            padding: 12, borderRadius: 14,
            background: 'var(--kindi-cream)',
            border: '1px solid var(--kindi-line)',
          }}>
            <div style={{ width: isMobile ? 100 : 144, flexShrink: 0 }}>
              <VideoThumb gradient={v.g} duration={v.dur} h={isMobile ? 60 : 84} radius={10}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.3, textWrap: 'pretty' }}>{v.title}</div>
              <div style={{ marginTop: 3, fontSize: 12.5, fontWeight: 600, color: 'var(--kindi-ink-soft)' }}>
                {v.creator} · {v.age}
              </div>
              <div style={{ marginTop: 6, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                <Pill icon={Icon.sparkle(10, 'var(--kindi-coral-deep)')}>{v.why}</Pill>
                <Pill>Auto-flag: safe</Pill>
              </div>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', gap: 6 }}>
                <Button variant="secondary" size="sm">Skip</Button>
                <Button variant="primary" size="sm" icon={Icon.check(13, '#fff')}>Allow</Button>
              </div>
            )}
            {isMobile && (
              <button style={{
                width: 40, height: 40, borderRadius: 999,
                background: 'var(--kindi-primary)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}>{Icon.check(16, '#fff')}</button>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Library({ isMobile }) {
  const channels = [
    { name: 'SciShow Kids',     count: 18, topic: 'Science', g: 5 },
    { name: 'Storyline Online', count: 12, topic: 'Stories', g: 2 },
    { name: 'Art for Kids Hub', count: 9,  topic: 'Make',    g: 7 },
    { name: 'Crash Course Kids',count: 22, topic: 'Science', g: 6 },
    { name: 'Free School',      count: 14, topic: 'Nature',  g: 8 },
    { name: 'Putumayo Kids',    count: 8,  topic: 'Music',   g: 4 },
  ];
  return (
    <Panel title="Approved channels" right={<Button variant="secondary" size="sm" icon={Icon.plus(12)}>Add channel</Button>}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 12 }}>
        {channels.map(c => (
          <div key={c.name} style={{
            padding: 14, borderRadius: 14, background: 'var(--kindi-paper)',
            border: '1px solid var(--kindi-line)',
            display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} className={`thumb-grad-${c.g}`}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--kindi-ink-soft)' }}>{c.count} videos · {c.topic}</div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Limits() {
  const [weekday, setWeekday] = React.useState(60);
  const [weekend, setWeekend] = React.useState(90);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Panel title="Daily time caps">
        <Slider label="Weekdays" value={weekday} onChange={setWeekday} max={180} suffix=" min"/>
        <Slider label="Weekends" value={weekend} onChange={setWeekend} max={180} suffix=" min"/>
      </Panel>
      <Panel title="Bedtime lockout" right={<Button variant="ghost" size="sm">Edit schedule</Button>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['Weekdays', 'Mon–Fri', '8:00 PM → 7:00 AM'],
            ['Weekends', 'Sat–Sun', '9:30 PM → 8:00 AM'],
          ].map(([t, d, h]) => (
            <div key={t} style={{
              padding: '12px 14px', borderRadius: 12, background: 'var(--kindi-cream)',
              border: '1px solid var(--kindi-line)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--kindi-cream-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Icon.moon(16, 'var(--kindi-ink)')}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{t}</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--kindi-ink-soft)' }}>{d} · {h}</div>
              </div>
              <div style={{
                width: 36, height: 22, borderRadius: 999, background: 'var(--kindi-coral-deep)', position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: 999,
                  background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                }}/>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Slider({ label, value, onChange, max = 100, suffix = '' }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{label}</span>
        <span className="t-mono" style={{ fontWeight: 700, fontSize: 13 }}>{value}{suffix}</span>
      </div>
      <input type="range" min="0" max={max} value={value} onChange={e => onChange(+e.target.value)}
        style={{ width: '100%', accentColor: 'oklch(0.62 0.18 32)' }}/>
    </div>
  );
}

function KidsTab({ isMobile }) {
  return (
    <Panel title="Kid profiles" right={<Button variant="secondary" size="sm" icon={Icon.plus(12)}>Add kid</Button>}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
        {KIDS.map(k => (
          <div key={k.name} style={{
            padding: 18, borderRadius: 16, background: 'var(--kindi-paper)',
            border: '1px solid var(--kindi-line)', boxShadow: 'var(--shadow-xs)',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <Avatar color={k.color} size={64} mood={k.mood} ring/>
            <div style={{ flex: 1 }}>
              <div className="kindi-display" style={{ fontSize: 22, fontWeight: 600 }}>{k.name}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--kindi-ink-soft)', marginBottom: 10 }}>
                Age {k.age} · 23 approved videos · {k.cap} min/day
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Button variant="secondary" size="sm">Edit</Button>
                <Button variant="ghost" size="sm">Curate library</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

Object.assign(window, { ParentDashboard });

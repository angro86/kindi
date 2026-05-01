'use client';

import { useState } from 'react';
import { SetupPageProps, ChildProfile, SessionDuration, RewardSettings } from '@/types';
import { ChildModal } from '@/components/modals/ChildModal';
import { VIDEOS } from '@/data/videos';
import { CATEGORIES } from '@/data/categories';
import { Button, Chip, KindiAvatar, KindiLogo, Icon } from '@/components/ui';

export function SetupPage({ kids, onStart, onAdd }: SetupPageProps) {
  const [step, setStep] = useState(1);
  const [sel, setSel] = useState<ChildProfile | null>(null);
  const [dur, setDur] = useState<SessionDuration>(30);
  const [cats, setCats] = useState<string[]>([]);
  const [modal, setModal] = useState(false);
  const [rewards, setRewards] = useState(true);
  const [goal, setGoal] = useState<3 | 5 | 10>(5);

  const ageGroup = sel ? (sel.age <= 3 ? 2 : sel.age <= 5 ? 4 : 6) : null;
  const avail = ageGroup ? Object.entries(CATEGORIES[ageGroup]) : [];
  const videoCount = ageGroup
    ? VIDEOS.filter((v) => ageGroup >= v.ageMin && ageGroup <= v.ageMax).length
    : 0;

  const canGo = () => (step === 1 ? !!sel : step === 2 ? cats.length > 0 : true);

  const next = () => {
    if (step === 3 && sel) {
      const rewardSettings: RewardSettings = { enabled: rewards, goal };
      onStart(sel, dur, cats, rewardSettings);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div
      className="kindi-body"
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(160deg, oklch(0.96 0.04 80) 0%, oklch(0.94 0.05 35) 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top header — logo + step indicator */}
      <header
        style={{
          padding: '24px 24px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          maxWidth: 720,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <KindiLogo size={20} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, marginLeft: 16 }}>
          <div style={{ flex: 1, display: 'flex', gap: 6 }}>
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                onClick={() => s < step && setStep(s)}
                disabled={s > step}
                aria-label={`Step ${s}`}
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  border: 'none',
                  background:
                    s <= step ? 'var(--kindi-coral-deep)' : 'var(--kindi-line-2)',
                  cursor: s < step ? 'pointer' : 'default',
                  padding: 0,
                }}
              />
            ))}
          </div>
          <span className="t-label" style={{ whiteSpace: 'nowrap' }}>
            Step {step} of 3
          </span>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '32px 24px',
          maxWidth: 720,
          margin: '0 auto',
          width: '100%',
        }}
      >
        {step === 1 && <Step1Profile kids={kids} sel={sel} setSel={setSel} setCats={setCats} videoCount={videoCount} onAddKid={() => setModal(true)} />}
        {step === 2 && <Step2Categories cats={cats} setCats={setCats} avail={avail} ageGroup={ageGroup!} />}
        {step === 3 && <Step3Settings dur={dur} setDur={setDur} rewards={rewards} setRewards={setRewards} goal={goal} setGoal={setGoal} />}
      </main>

      <footer
        style={{
          padding: '0 24px 32px',
          maxWidth: 720,
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          gap: 10,
        }}
      >
        {step > 1 && (
          <Button variant="secondary" size="lg" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        <div style={{ flex: 1 }}>
          <Button
            variant="primary"
            size="lg"
            onClick={next}
            disabled={!canGo()}
            fullWidth
            iconRight={step === 3 ? undefined : <Icon.arrowR color="#fff" size={14} />}
          >
            {step === 3 ? "Let's go" : 'Next'}
          </Button>
        </div>
      </footer>

      {modal && <ChildModal onSave={onAdd} onClose={() => setModal(false)} />}
    </div>
  );
}

function Step1Profile({
  kids,
  sel,
  setSel,
  setCats,
  videoCount,
  onAddKid,
}: {
  kids: ChildProfile[];
  sel: ChildProfile | null;
  setSel: (k: ChildProfile) => void;
  setCats: (c: string[]) => void;
  videoCount: number;
  onAddKid: () => void;
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="t-label">Tap your friend</div>
      <h1
        className="kindi-display"
        style={{
          margin: '6px 0 36px',
          fontSize: 44,
          fontWeight: 600,
          letterSpacing: '-0.03em',
        }}
      >
        Who is <span className="squig">watching?</span>
      </h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(kids.length + 1, 4)}, 1fr)`,
          gap: 22,
          maxWidth: 560,
          margin: '0 auto',
        }}
      >
        {kids.map((k) => {
          const isSel = sel?.id === k.id;
          return (
            <button
              key={k.id}
              onClick={() => {
                setSel(k);
                setCats([]);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                opacity: isSel || !sel ? 1 : 0.55,
                transform: isSel ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform .18s, opacity .18s',
              }}
            >
              <KindiAvatar avatarIndex={k.avatar || 0} size={104} ring={isSel} happy />
              <div className="kindi-display" style={{ fontSize: 22, fontWeight: 600 }}>
                {k.name}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--kindi-ink-soft)' }}>
                {k.age} years old
              </div>
            </button>
          );
        })}
        <button
          onClick={onAddKid}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            opacity: 0.6,
          }}
        >
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: 999,
              border: '2px dashed var(--kindi-line-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon.plus size={28} color="var(--kindi-ink-soft)" />
          </div>
          <div className="kindi-display" style={{ fontSize: 22, fontWeight: 600 }}>
            Add kid
          </div>
        </button>
      </div>
      {sel && (
        <p
          style={{
            marginTop: 28,
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--kindi-ink-soft)',
          }}
        >
          {videoCount} videos for age {sel.age}
        </p>
      )}
    </div>
  );
}

const CAT_BG = [
  'var(--kindi-mint)',
  'var(--kindi-sky)',
  'var(--kindi-butter)',
  'var(--kindi-lilac)',
  'var(--kindi-blush)',
  'var(--kindi-mint)',
  'var(--kindi-butter)',
  'var(--kindi-sky)',
];

function Step2Categories({
  cats,
  setCats,
  avail,
  ageGroup,
}: {
  cats: string[];
  setCats: (fn: (p: string[]) => string[]) => void;
  avail: [string, string][];
  ageGroup: number;
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="t-label">Pick adventures</div>
      <h1
        className="kindi-display"
        style={{
          margin: '6px 0 8px',
          fontSize: 40,
          fontWeight: 600,
          letterSpacing: '-0.03em',
        }}
      >
        What do you <span className="squig">love?</span>
      </h1>
      <p
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--kindi-ink-soft)',
        }}
      >
        Pick a few. We&apos;ll fill your library with these things.
      </p>

      <div
        style={{
          marginTop: 28,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 14,
          maxWidth: 600,
          margin: '28px auto 0',
        }}
      >
        {avail.map(([k, l], i) => {
          const isSel = cats.includes(k);
          const emoji = l.split(' ')[0];
          const label = l.split(' ').slice(1).join(' ');
          const count = VIDEOS.filter(
            (v) => ageGroup >= v.ageMin && ageGroup <= v.ageMax && v.cat === k,
          ).length;
          const bg = CAT_BG[i % CAT_BG.length];
          return (
            <button
              key={k}
              onClick={() => setCats((p) => (p.includes(k) ? p.filter((c) => c !== k) : [...p, k]))}
              style={{
                position: 'relative',
                padding: '20px 14px',
                borderRadius: 18,
                background: isSel ? bg : 'var(--kindi-paper)',
                border: isSel
                  ? `2px solid var(--kindi-ink)`
                  : '1px solid var(--kindi-line)',
                boxShadow: isSel
                  ? '0 4px 12px rgba(40,30,20,0.15)'
                  : 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                transition: 'all .14s',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: isSel ? 'var(--kindi-paper)' : bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  lineHeight: 1,
                }}
              >
                {emoji}
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 800 }}>{label}</div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--kindi-ink-soft)',
                  fontFamily: 'var(--kindi-mono)',
                }}
              >
                {count} videos
              </div>
              {isSel && (
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    background: 'var(--kindi-ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon.check size={12} color="#fff" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step3Settings({
  dur,
  setDur,
  rewards,
  setRewards,
  goal,
  setGoal,
}: {
  dur: SessionDuration;
  setDur: (d: SessionDuration) => void;
  rewards: boolean;
  setRewards: (r: boolean) => void;
  goal: 3 | 5 | 10;
  setGoal: (g: 3 | 5 | 10) => void;
}) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto', width: '100%' }}>
      <div className="t-label">Almost there</div>
      <h1
        className="kindi-display"
        style={{
          margin: '6px 0 28px',
          fontSize: 40,
          fontWeight: 600,
          letterSpacing: '-0.03em',
        }}
      >
        Set the <span className="squig">session</span>
      </h1>

      <div className="surface" style={{ padding: 20, borderRadius: 20, marginBottom: 14, textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Icon.clock size={16} color="var(--kindi-coral-deep)" />
          <span className="t-h3">How long?</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {([15, 30, 45, 60] as const).map((m) => (
            <Chip key={m} active={dur === m} onClick={() => setDur(m)} style={{ flex: 1, justifyContent: 'center' }}>
              {m} min
            </Chip>
          ))}
        </div>
      </div>

      <div className="surface" style={{ padding: 20, borderRadius: 20, textAlign: 'left' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: rewards ? 12 : 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon.star size={16} color="oklch(0.78 0.16 75)" />
            <span className="t-h3">Star rewards</span>
          </div>
          <button
            onClick={() => setRewards(!rewards)}
            aria-label="Toggle rewards"
            style={{
              width: 44,
              height: 26,
              borderRadius: 999,
              background: rewards ? 'var(--kindi-coral-deep)' : 'var(--kindi-line-2)',
              border: 'none',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background .14s',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 3,
                left: rewards ? 21 : 3,
                width: 20,
                height: 20,
                borderRadius: 999,
                background: '#fff',
                transition: 'left .16s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}
            />
          </button>
        </div>
        {rewards && (
          <>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--kindi-ink-soft)',
                marginBottom: 10,
              }}
            >
              Stars to earn a bonus
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {([3, 5, 10] as const).map((n) => (
                <Chip key={n} active={goal === n} onClick={() => setGoal(n)} style={{ flex: 1, justifyContent: 'center' }}>
                  {n} stars
                </Chip>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

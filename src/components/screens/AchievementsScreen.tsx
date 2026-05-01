'use client';

import { Icon, KindiBlob } from '@/components/ui';
import { STICKERS, nextSticker } from '@/lib/stickers';

interface AchievementsScreenProps {
  childName: string;
  totalStars: number;
  unlockedIds: string[];
}

export function AchievementsScreen({ childName, totalStars, unlockedIds }: AchievementsScreenProps) {
  const earned = unlockedIds.length;
  const next = nextSticker(totalStars);
  const toNext = next ? next.threshold - totalStars : 0;

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 48px' }}>
      <h1
        className="kindi-display"
        style={{
          margin: '0 0 22px',
          fontSize: 32,
          fontWeight: 600,
          letterSpacing: '-0.022em',
        }}
      >
        {childName}&apos;s <span className="squig">stickers</span>
      </h1>

      <div
        style={{
          padding: 22,
          borderRadius: 22,
          background: 'linear-gradient(140deg, oklch(0.94 0.07 90), oklch(0.92 0.08 35))',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          marginBottom: 28,
          border: '1px solid var(--kindi-line)',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 999,
            background: 'var(--kindi-paper)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            flexShrink: 0,
          }}
        >
          <Icon.star size={36} color="oklch(0.78 0.16 75)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="t-label">Total stars</div>
          <div
            className="kindi-display"
            style={{
              fontSize: 44,
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            {totalStars}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--kindi-ink-soft)',
              marginTop: 4,
            }}
          >
            {earned} of {STICKERS.length} stickers earned
            {next && ` · ${toNext} star${toNext === 1 ? '' : 's'} to next`}
          </div>
        </div>
      </div>

      <h3 className="t-h3" style={{ marginBottom: 12 }}>
        Sticker shelf
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 14,
        }}
      >
        {STICKERS.map((s) => {
          const unlocked = unlockedIds.includes(s.id);
          return (
            <div
              key={s.id}
              style={{
                position: 'relative',
                padding: 18,
                borderRadius: 18,
                background: unlocked ? 'var(--kindi-paper)' : 'var(--kindi-cream-2)',
                border: unlocked
                  ? '1px solid var(--kindi-line)'
                  : '1px dashed var(--kindi-line-2)',
                boxShadow: unlocked ? 'var(--shadow-sm)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                textAlign: 'center',
                opacity: unlocked ? 1 : 0.6,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: s.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter: unlocked ? 'none' : 'grayscale(0.8)',
                  boxShadow: unlocked ? '0 6px 16px rgba(40,30,20,0.12)' : 'none',
                }}
              >
                <KindiBlob color={s.color} size={80} mood={s.mood} />
              </div>
              {!unlocked && (
                <div
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    width: 26,
                    height: 26,
                    borderRadius: 999,
                    background: 'var(--kindi-cream-3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon.lock size={12} color="var(--kindi-ink-soft)" />
                </div>
              )}
              <div
                className="kindi-display"
                style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em' }}
              >
                {s.name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--kindi-ink-soft)',
                  lineHeight: 1.4,
                }}
              >
                {s.rule}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

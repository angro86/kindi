'use client';

import { Button, Icon, KindiBlob } from '@/components/ui';
import { Sticker, nextSticker } from '@/lib/stickers';

interface StickerUnlockModalProps {
  childName: string;
  sticker: Sticker;
  totalStars: number;
  onContinue: () => void;
}

export function StickerUnlockModal({
  childName,
  sticker,
  totalStars,
  onContinue,
}: StickerUnlockModalProps) {
  const next = nextSticker(totalStars);
  const progress = next ? Math.min(1, totalStars / next.threshold) : 1;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background:
          'linear-gradient(160deg, oklch(0.92 0.07 90) 0%, oklch(0.88 0.10 35) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: 24 }).map((_, i) => {
        const colors = [
          'var(--kindi-coral)',
          'var(--kindi-mint-mid)',
          'var(--kindi-butter-mid)',
          'var(--kindi-lilac-mid)',
          'var(--kindi-sky-mid)',
        ];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${(i * 37) % 90}%`,
              left: `${(i * 53) % 100}%`,
              width: 8 + (i % 3) * 4,
              height: 8 + (i % 3) * 4,
              borderRadius: i % 2 ? 999 : 2,
              background: colors[i % 5],
              opacity: 0.6,
              transform: `rotate(${i * 23}deg)`,
            }}
          />
        );
      })}

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 460 }}>
        <KindiBlob color={sticker.color} size={128} mood={sticker.mood} />
        <div className="t-label" style={{ marginTop: 18 }}>
          Nice work, {childName}
        </div>
        <h1
          className="kindi-display"
          style={{
            margin: '6px 0 14px',
            fontSize: 48,
            fontWeight: 600,
            letterSpacing: '-0.035em',
            lineHeight: 1.05,
          }}
        >
          You unlocked <span className="squig">{sticker.name}</span>
        </h1>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            borderRadius: 999,
            background: 'var(--kindi-paper)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <Icon.star size={24} color="oklch(0.78 0.16 75)" />
          <span
            className="kindi-display"
            style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}
          >
            {totalStars} total stars
          </span>
        </div>

        {next && (
          <div style={{ marginTop: 24, width: '100%' }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--kindi-ink-soft)',
                marginBottom: 6,
              }}
            >
              {next.threshold - totalStars} more to unlock {next.name}
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 4,
                background: 'rgba(255,255,255,0.6)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress * 100}%`,
                  height: '100%',
                  background: 'oklch(0.78 0.16 75)',
                  transition: 'width .3s',
                }}
              />
            </div>
          </div>
        )}

        <div style={{ marginTop: 28 }}>
          <Button
            variant="primary"
            size="lg"
            onClick={onContinue}
            iconRight={<Icon.arrowR size={14} color="#fff" />}
          >
            Keep watching
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { JarFullModalProps } from '@/types';
import { Button, Icon, KindiBlob } from '@/components/ui';

export function JarFullModal({ name, onClaim }: JarFullModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
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
      {/* Confetti */}
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

      <div style={{ position: 'relative', zIndex: 2 }}>
        <KindiBlob color="var(--kindi-coral)" size={120} mood="wow" />
        <div className="t-label" style={{ marginTop: 18 }}>
          Nice work, {name}
        </div>
        <h1
          className="kindi-display"
          style={{
            margin: '6px 0 18px',
            fontSize: 56,
            fontWeight: 600,
            letterSpacing: '-0.035em',
          }}
        >
          Bonus <span className="squig">unlocked!</span>
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
            All stars earned
          </span>
        </div>

        <div style={{ marginTop: 32 }}>
          <Button
            variant="primary"
            size="lg"
            onClick={onClaim}
            icon={<Icon.play size={14} color="#fff" />}
          >
            Pick a bonus video
          </Button>
        </div>
      </div>
    </div>
  );
}

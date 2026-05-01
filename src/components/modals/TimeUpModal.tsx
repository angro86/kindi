'use client';

import { Button, Icon, KindiBlob } from '@/components/ui';

interface TimeUpModalProps {
  name: string;
  duration: number;
  onEnd: () => void;
}

export function TimeUpModal({ name, duration, onEnd }: TimeUpModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background:
          'linear-gradient(160deg, oklch(0.94 0.05 95) 0%, oklch(0.90 0.07 35) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        textAlign: 'center',
      }}
    >
      <KindiBlob color="var(--kindi-mint-mid)" size={120} mood="sleepy" />
      <div className="t-label" style={{ marginTop: 18 }}>
        That&apos;s a wrap
      </div>
      <h1
        className="kindi-display"
        style={{
          margin: '6px 0 14px',
          fontSize: 56,
          fontWeight: 600,
          letterSpacing: '-0.035em',
        }}
      >
        Time&apos;s <span className="squig">up</span>
      </h1>
      <p
        style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--kindi-ink-soft)',
          maxWidth: 360,
        }}
      >
        {name} had {duration} minutes of fun. See you next time!
      </p>
      <div style={{ marginTop: 28 }}>
        <Button
          variant="primary"
          size="lg"
          onClick={onEnd}
          icon={<Icon.check size={14} color="#fff" />}
        >
          All done
        </Button>
      </div>
    </div>
  );
}

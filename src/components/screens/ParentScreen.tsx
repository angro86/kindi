'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChildProfile } from '@/types';
import { storage } from '@/lib/storage';
import { STICKERS, stickersUnlockedFor } from '@/lib/stickers';
import { Button, Icon, KindiAvatar, KindiLogo } from '@/components/ui';

export function ParentScreen() {
  const [hydrated, setHydrated] = useState(false);
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [kids, setKids] = useState<ChildProfile[]>([]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setStoredPin(storage.getParentPin());
    setKids(storage.getKids());
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!hydrated) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--kindi-cream)' }} />
    );
  }

  if (!unlocked) {
    return (
      <PinGate
        storedPin={storedPin}
        onSet={(pin) => {
          storage.setParentPin(pin);
          setStoredPin(pin);
        }}
        onUnlock={() => setUnlocked(true)}
      />
    );
  }

  return <Dashboard kids={kids} />;
}

function PinGate({
  storedPin,
  onSet,
  onUnlock,
}: {
  storedPin: string | null;
  onSet: (pin: string) => void;
  onUnlock: () => void;
}) {
  const isSetup = storedPin === null;
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isSetup) {
      if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        setError('PIN must be 4 digits.');
        return;
      }
      if (pin !== confirm) {
        setError('PINs do not match.');
        return;
      }
      onSet(pin);
      onUnlock();
    } else {
      if (pin === storedPin) {
        onUnlock();
      } else {
        setError('Wrong PIN. Try again.');
        setPin('');
      }
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <KindiLogo size={20} />
      </div>
      <form
        onSubmit={submit}
        className="surface-float"
        style={{
          background: 'var(--kindi-paper)',
          borderRadius: 24,
          padding: 32,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Icon.lock size={28} color="var(--kindi-coral-deep)" />
        <h1
          className="kindi-display"
          style={{ margin: '12px 0 6px', fontSize: 26, fontWeight: 600 }}
        >
          {isSetup ? 'Create a parent PIN' : 'Enter your PIN'}
        </h1>
        <p
          style={{
            margin: '0 0 22px',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--kindi-ink-soft)',
          }}
        >
          {isSetup
            ? 'Set a 4-digit PIN. You&apos;ll need this to access the parent dashboard.'
            : 'Only parents can see the dashboard.'}
        </p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          autoFocus
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          placeholder="••••"
          style={{
            width: '100%',
            padding: '14px 16px',
            fontSize: 24,
            textAlign: 'center',
            letterSpacing: '0.5em',
            fontFamily: 'var(--kindi-mono)',
            border: '1px solid var(--kindi-line-2)',
            borderRadius: 12,
            background: 'var(--kindi-cream-2)',
            outline: 'none',
            marginBottom: 12,
          }}
        />
        {isSetup && (
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value.replace(/\D/g, ''))}
            placeholder="Confirm"
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: 18,
              textAlign: 'center',
              letterSpacing: '0.4em',
              fontFamily: 'var(--kindi-mono)',
              border: '1px solid var(--kindi-line-2)',
              borderRadius: 12,
              background: 'var(--kindi-cream-2)',
              outline: 'none',
              marginBottom: 12,
            }}
          />
        )}
        {error && (
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--kindi-coral-deep)',
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        )}
        <Button type="submit" variant="primary" size="lg" fullWidth>
          {isSetup ? 'Create PIN' : 'Unlock'}
        </Button>
        <div style={{ marginTop: 16 }}>
          <Link
            href="/"
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--kindi-ink-soft)',
              textDecoration: 'none',
            }}
          >
            ← Back to kid mode
          </Link>
        </div>
      </form>
    </div>
  );
}

function Dashboard({ kids }: { kids: ChildProfile[] }) {
  return (
    <div
      className="kindi-body"
      style={{ minHeight: '100vh', background: 'var(--kindi-cream)' }}
    >
      <header
        style={{
          background: 'rgba(252, 250, 246, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--kindi-line)',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <KindiLogo size={18} />
          <Link href="/">
            <Button variant="secondary" size="sm">
              Exit dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 48px' }}>
        <h1
          className="kindi-display"
          style={{
            margin: '0 0 6px',
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: '-0.022em',
          }}
        >
          Parent <span className="squig">dashboard</span>
        </h1>
        <p
          style={{
            margin: '0 0 28px',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--kindi-ink-soft)',
          }}
        >
          Overview, approve queue, library, limits — coming soon. For now: a quick look at each kid&apos;s progress.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {kids.map((k) => (
            <KidCard key={k.id} kid={k} />
          ))}
        </div>
      </main>
    </div>
  );
}

function KidCard({ kid }: { kid: ChildProfile }) {
  const [stars, setStars] = useState(0);
  const [history, setHistory] = useState<number>(0);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setStars(storage.getStars(kid.id));
    setHistory(storage.getHistory(kid.id).length);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [kid.id]);

  const unlocked = stickersUnlockedFor(stars).length;

  return (
    <div
      className="surface-raised"
      style={{
        background: 'var(--kindi-paper)',
        borderRadius: 18,
        padding: 20,
        border: '1px solid var(--kindi-line)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <KindiAvatar avatarIndex={kid.avatar || 0} size={48} />
        <div>
          <div
            className="kindi-display"
            style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.018em' }}
          >
            {kid.name}
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--kindi-ink-soft)',
            }}
          >
            {kid.age} years old
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <Stat label="Stars" value={stars} />
        <Stat label="Stickers" value={`${unlocked}/${STICKERS.length}`} />
        <Stat label="Watched" value={history} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="t-label">{label}</div>
      <div
        className="kindi-display"
        style={{
          fontSize: 22,
          fontWeight: 600,
          lineHeight: 1.1,
          marginTop: 2,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>
    </div>
  );
}

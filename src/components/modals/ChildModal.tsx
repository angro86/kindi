'use client';

import { useState } from 'react';
import { ChildModalProps, AvatarIndex } from '@/types';
import { AVATAR_NAMES } from '@/lib/constants';
import { Button, Icon, KindiAvatar } from '@/components/ui';

export function ChildModal({ child, onSave, onClose }: ChildModalProps) {
  const [name, setName] = useState(child?.name || '');
  const [age, setAge] = useState(child?.age || 4);
  const [av, setAv] = useState<AvatarIndex>(child?.avatar || 0);

  const handleSave = () => {
    if (name.trim()) {
      onSave({ id: child?.id || Date.now(), name: name.trim(), age, avatar: av });
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(20,15,10,0.55)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          background: 'var(--kindi-cream)',
          borderRadius: 24,
          padding: 28,
          maxWidth: 460,
          width: '100%',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--kindi-line)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 18,
          }}
        >
          <h2 className="kindi-display" style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>
            {child ? 'Edit profile' : 'Add a kid'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--kindi-ink-soft)',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
            }}
          >
            <Icon.x size={18} />
          </button>
        </div>

        <div className="t-label" style={{ marginBottom: 10 }}>
          Pick an avatar
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 10,
            marginBottom: 18,
          }}
        >
          {[0, 1, 2, 3].map((i) => {
            const isSel = av === i;
            return (
              <button
                key={i}
                onClick={() => setAv(i as AvatarIndex)}
                style={{
                  background: isSel ? 'var(--kindi-paper)' : 'transparent',
                  border: isSel
                    ? '2px solid var(--kindi-ink)'
                    : '1px solid var(--kindi-line)',
                  borderRadius: 14,
                  padding: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
              >
                <KindiAvatar avatarIndex={i} size={48} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--kindi-ink-soft)' }}>
                  {AVATAR_NAMES[i]}
                </span>
              </button>
            );
          })}
        </div>

        <label className="t-label" style={{ display: 'block', marginBottom: 6 }}>
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type a name"
          style={{
            width: '100%',
            padding: '12px 14px',
            border: '1px solid var(--kindi-line-2)',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 700,
            fontFamily: 'var(--kindi-body)',
            background: 'var(--kindi-paper)',
            outline: 'none',
            marginBottom: 18,
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <span className="t-label">Age</span>
          <span
            className="t-mono"
            style={{ fontWeight: 700, fontSize: 14, color: 'var(--kindi-ink)' }}
          >
            {age}
          </span>
        </div>
        <input
          type="range"
          min={2}
          max={8}
          value={age}
          onChange={(e) => setAge(+e.target.value)}
          style={{ width: '100%', marginBottom: 22, accentColor: 'var(--kindi-coral-deep)' }}
        />

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <Button variant="secondary" size="lg" onClick={onClose} fullWidth>
              Cancel
            </Button>
          </div>
          <div style={{ flex: 1 }}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSave}
              disabled={!name.trim()}
              fullWidth
            >
              {child ? 'Save' : 'Add'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

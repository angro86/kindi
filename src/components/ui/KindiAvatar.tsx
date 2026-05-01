import { CSSProperties } from 'react';
import { avatars } from '@/components/avatars';

const AVATAR_COLORS = [
  'var(--kindi-blush-mid)',
  'var(--kindi-mint-mid)',
  'var(--kindi-butter-mid)',
  'var(--kindi-sky-mid)',
  'var(--kindi-lilac-mid)',
  'var(--kindi-coral)',
];

interface KindiAvatarProps {
  avatarIndex?: number;
  size?: number;
  ring?: boolean;
  happy?: boolean;
  style?: CSSProperties;
}

export function KindiAvatar({
  avatarIndex = 0,
  size = 44,
  ring = false,
  happy = true,
  style,
}: KindiAvatarProps) {
  const Animal = avatars[avatarIndex % avatars.length];
  const color = AVATAR_COLORS[avatarIndex % AVATAR_COLORS.length];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        position: 'relative',
        boxShadow: ring
          ? `0 0 0 3px var(--kindi-paper), 0 0 0 5px var(--kindi-coral)`
          : '0 1px 2px rgba(40,30,20,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        ...style,
      }}
    >
      <Animal size={Math.round(size * 0.7)} happy={happy} />
    </div>
  );
}

export { AVATAR_COLORS };

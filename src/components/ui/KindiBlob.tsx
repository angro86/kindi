import { CSSProperties } from 'react';

type Mood = 'happy' | 'wow' | 'wink' | 'sleepy';

interface KindiBlobProps {
  color?: string;
  size?: number;
  mood?: Mood;
  style?: CSSProperties;
}

export function KindiBlob({
  color = 'var(--kindi-blush-mid)',
  size = 80,
  mood = 'happy',
  style,
}: KindiBlobProps) {
  const eye = (cx: number) => {
    if (mood === 'sleepy')
      return (
        <path
          d={`M${cx - 5} 0 Q${cx} 4 ${cx + 5} 0`}
          stroke="#1f1c14"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      );
    if (mood === 'wow') return <ellipse cx={cx} cy="-1" rx="3" ry="4" fill="#1f1c14" />;
    if (mood === 'wink' && cx > 50)
      return (
        <path
          d={`M${cx - 5} 0 Q${cx} 4 ${cx + 5} 0`}
          stroke="#1f1c14"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      );
    return <ellipse cx={cx} cy="0" rx="3.2" ry="3.6" fill="#1f1c14" />;
  };
  const mouth =
    mood === 'wow' ? (
      <ellipse cx="50" cy="64" rx="6" ry="7" fill="#1f1c14" />
    ) : mood === 'sleepy' ? (
      <path
        d="M44 62 Q50 65 56 62"
        stroke="#1f1c14"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    ) : (
      <path
        d="M41 56 Q50 67 59 56"
        stroke="#1f1c14"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
    );
  const gradId = `kindi-blob-gradient-${mood}-${size}`;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style}>
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <path
        d="M 50 6 C 80 6 92 28 92 52 C 92 78 76 94 50 94 C 24 94 8 78 8 52 C 8 28 20 6 50 6 Z"
        fill={color}
      />
      <path
        d="M 50 6 C 80 6 92 28 92 52 C 92 78 76 94 50 94 C 24 94 8 78 8 52 C 8 28 20 6 50 6 Z"
        fill={`url(#${gradId})`}
      />
      <ellipse cx="28" cy="60" rx="6" ry="4" fill="oklch(0.78 0.13 25 / 0.45)" />
      <ellipse cx="72" cy="60" rx="6" ry="4" fill="oklch(0.78 0.13 25 / 0.45)" />
      <g transform="translate(0 46)">
        {eye(38)}
        {eye(62)}
      </g>
      {mouth}
    </svg>
  );
}

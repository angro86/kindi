import { CSSProperties, ReactNode } from 'react';

interface PillProps {
  children: ReactNode;
  color?: string;
  tone?: 'soft' | 'firm';
  icon?: ReactNode;
  style?: CSSProperties;
}

export function Pill({
  children,
  color = 'var(--kindi-cream-2)',
  tone = 'soft',
  icon,
  style,
}: PillProps) {
  const isSoft = tone === 'soft';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '4px 10px',
        borderRadius: 999,
        background: color,
        color: 'var(--kindi-ink)',
        border: isSoft ? '1px solid rgba(40,30,20,0.06)' : '1px solid var(--kindi-line)',
        fontFamily: 'var(--kindi-body)',
        fontSize: 11.5,
        fontWeight: 700,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon}
      {children}
    </span>
  );
}

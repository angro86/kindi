import { CSSProperties, ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  style?: CSSProperties;
}

export function Chip({ children, active = false, onClick, icon, style }: ChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px',
        borderRadius: 999,
        background: active ? 'var(--kindi-ink)' : 'var(--kindi-paper)',
        color: active ? 'var(--kindi-cream)' : 'var(--kindi-ink)',
        border: active ? '1px solid var(--kindi-ink)' : '1px solid var(--kindi-line-2)',
        boxShadow: active
          ? '0 4px 10px rgba(40,30,20,0.18)'
          : '0 1px 1px rgba(40,30,20,0.03)',
        fontFamily: 'var(--kindi-body)',
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        whiteSpace: 'nowrap',
        transition: 'all .14s',
        ...style,
      }}
    >
      {icon}
      {children}
    </button>
  );
}

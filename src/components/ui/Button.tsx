import { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'accent';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
  fullWidth?: boolean;
}

const sizeStyles: Record<Size, { p: string; f: number; r: number; gap: number }> = {
  lg: { p: '14px 22px', f: 15, r: 14, gap: 10 },
  sm: { p: '7px 12px', f: 12.5, r: 10, gap: 6 },
  md: { p: '11px 18px', f: 14, r: 12, gap: 8 },
};

const variantStyles: Record<Variant, CSSProperties> = {
  primary: {
    background: 'var(--kindi-primary)',
    color: 'var(--kindi-primary-fg)',
    boxShadow:
      '0 1px 0 rgba(255,255,255,0.2) inset, 0 1px 2px rgba(40,30,20,0.1), 0 4px 10px oklch(0.62 0.18 32 / 0.25)',
    border: '1px solid oklch(0.5 0.16 32)',
  },
  secondary: {
    background: 'var(--kindi-paper)',
    color: 'var(--kindi-ink)',
    boxShadow: '0 1px 2px rgba(40,30,20,0.04), 0 2px 4px rgba(40,30,20,0.04)',
    border: '1px solid var(--kindi-line-2)',
  },
  soft: {
    background: 'var(--kindi-cream-2)',
    color: 'var(--kindi-ink)',
    boxShadow: 'none',
    border: '1px solid transparent',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--kindi-ink)',
    boxShadow: 'none',
    border: '1px solid transparent',
  },
  accent: {
    background: 'var(--kindi-ink)',
    color: 'var(--kindi-cream)',
    boxShadow: '0 1px 0 rgba(255,255,255,0.1) inset, 0 4px 12px rgba(40,30,20,0.25)',
    border: '1px solid var(--kindi-ink)',
  },
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  children,
  style,
  fullWidth,
  disabled,
  ...rest
}: ButtonProps) {
  const sz = sizeStyles[size];
  return (
    <button
      {...rest}
      disabled={disabled}
      style={{
        padding: sz.p,
        borderRadius: sz.r,
        fontSize: sz.f,
        fontWeight: 700,
        fontFamily: 'var(--kindi-body)',
        display: fullWidth ? 'flex' : 'inline-flex',
        width: fullWidth ? '100%' : undefined,
        justifyContent: 'center',
        alignItems: 'center',
        gap: sz.gap,
        transition: 'transform .12s, box-shadow .12s, background .12s, opacity .12s',
        letterSpacing: '0.005em',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}

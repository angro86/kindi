import { KindiBlob } from './KindiBlob';

interface KindiLogoProps {
  size?: number;
  dark?: boolean;
}

export function KindiLogo({ size = 22, dark = false }: KindiLogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.36 }}>
      <KindiBlob color="var(--kindi-coral)" size={size * 1.35} />
      <span
        className="kindi-display"
        style={{
          fontSize: size * 1.55,
          fontWeight: 700,
          lineHeight: 1,
          color: dark ? 'var(--kindi-cream)' : 'var(--kindi-ink)',
          letterSpacing: '-0.045em',
        }}
      >
        kindi
      </span>
    </div>
  );
}

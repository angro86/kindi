interface StarsProps {
  value?: number;
  max?: number;
  size?: number;
}

export function Stars({ value = 4, max = 5, size = 12 }: StarsProps) {
  return (
    <span style={{ display: 'inline-flex', gap: 1.5 }}>
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < value ? 'oklch(0.78 0.16 75)' : 'var(--kindi-line-2)'}
        >
          <path d="M12 2 L15 9 L22 9.5 L17 14.5 L18.5 22 L12 18 L5.5 22 L7 14.5 L2 9.5 L9 9 Z" />
        </svg>
      ))}
    </span>
  );
}

import { AvatarProps } from '@/types';

export function Panda({ size = 60 }: AvatarProps) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      <circle cx="40" cy="44" r="30" fill="#FFF" />
      <circle cx="16" cy="22" r="10" fill="#333" />
      <circle cx="64" cy="22" r="10" fill="#333" />
      <ellipse cx="28" cy="40" rx="11" ry="13" fill="#333" />
      <ellipse cx="52" cy="40" rx="11" ry="13" fill="#333" />
      <circle cx="28" cy="40" r="6" fill="#FFF" />
      <circle cx="52" cy="40" r="6" fill="#FFF" />
      <circle cx="28" cy="40" r="3" fill="#333" />
      <circle cx="52" cy="40" r="3" fill="#333" />
      <ellipse cx="40" cy="52" rx="6" ry="4" fill="#333" />
    </svg>
  );
}

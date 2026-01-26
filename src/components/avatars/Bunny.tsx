import { AvatarProps } from '@/types';

export function Bunny({ size = 60 }: AvatarProps) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      <circle cx="40" cy="48" r="28" fill="#FFB6C1" />
      <ellipse cx="25" cy="18" rx="10" ry="24" fill="#FFB6C1" />
      <ellipse cx="55" cy="18" rx="10" ry="24" fill="#FFB6C1" />
      <circle cx="30" cy="45" r="5" fill="#333" />
      <circle cx="50" cy="45" r="5" fill="#333" />
      <ellipse cx="40" cy="54" rx="4" ry="2.5" fill="#FF8A80" />
    </svg>
  );
}

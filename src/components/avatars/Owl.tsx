import { AvatarProps } from '@/types';

export function Owl({ size = 60 }: AvatarProps) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      <circle cx="40" cy="44" r="30" fill="#8D6E63" />
      <ellipse cx="40" cy="46" rx="22" ry="20" fill="#D7CCC8" />
      <circle cx="30" cy="42" r="10" fill="#FFF" />
      <circle cx="50" cy="42" r="10" fill="#FFF" />
      <circle cx="30" cy="42" r="5" fill="#333" />
      <circle cx="50" cy="42" r="5" fill="#333" />
      <polygon points="40,50 35,58 45,58" fill="#FF9800" />
    </svg>
  );
}

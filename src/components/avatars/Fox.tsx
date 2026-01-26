import { AvatarProps } from '@/types';

export function Fox({ size = 60, happy }: AvatarProps) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      <circle cx="40" cy="42" r="32" fill="#FF9A5C" />
      <polygon points="12,20 25,45 5,40" fill="#FF9A5C" />
      <polygon points="68,20 55,45 75,40" fill="#FF9A5C" />
      <ellipse cx="40" cy="52" rx="18" ry="14" fill="#FFD4B8" />
      <circle cx="30" cy="38" r="6" fill="#333" />
      <circle cx="50" cy="38" r="6" fill="#333" />
      <ellipse cx="40" cy="48" rx="4" ry="3" fill="#333" />
      {happy && <ellipse cx="40" cy="58" rx="6" ry="5" fill="#333" />}
    </svg>
  );
}

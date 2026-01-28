import { IconProps } from '@/types';

export function Pause({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <rect x="6" y="4" width="4" height="16" fill="currentColor" />
      <rect x="14" y="4" width="4" height="16" fill="currentColor" />
    </svg>
  );
}

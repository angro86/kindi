import { ReactNode } from 'react';

interface IconWrapProps {
  size?: number;
  color?: string;
  children: ReactNode;
  fill?: boolean;
  viewBox?: number;
  strokeWidth?: number;
}

function I({
  size = 16,
  color = 'currentColor',
  children,
  fill = false,
  viewBox = 16,
  strokeWidth = 1.6,
}: IconWrapProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      fill={fill ? color : 'none'}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

interface IconProps {
  size?: number;
  color?: string;
}

export const Icon = {
  play: (p: IconProps = {}) => (
    <I {...p}>
      <path d="M5 3 L13 8 L5 13 Z" fill="currentColor" />
    </I>
  ),
  pause: (p: IconProps = {}) => (
    <I {...p}>
      <rect x="4" y="3" width="3" height="10" rx="1" fill="currentColor" />
      <rect x="9" y="3" width="3" height="10" rx="1" fill="currentColor" />
    </I>
  ),
  heart: (p: IconProps = {}) => (
    <I {...p}>
      <path
        d="M8 13 C 3 9 1 6 3 4 C 5 2 7 3 8 4 C 9 3 11 2 13 4 C 15 6 13 9 8 13 Z"
        fill="currentColor"
      />
    </I>
  ),
  star: (p: IconProps = {}) => (
    <I {...p}>
      <path
        d="M8 2 L10 6.5 L15 7 L11 10.5 L12 15 L8 12.5 L4 15 L5 10.5 L1 7 L6 6.5 Z"
        fill="currentColor"
      />
    </I>
  ),
  clock: (p: IconProps = {}) => (
    <I {...p}>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5 V 8 L 10 9.5" />
    </I>
  ),
  lock: (p: IconProps = {}) => (
    <I {...p}>
      <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
      <path d="M5.5 7 V 5 a2.5 2.5 0 0 1 5 0 V 7" />
    </I>
  ),
  search: (p: IconProps = {}) => (
    <I {...p}>
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5 L14 14" />
    </I>
  ),
  check: (p: IconProps = {}) => (
    <I {...p}>
      <path d="M3 8 L6.5 11 L13 4.5" />
    </I>
  ),
  plus: (p: IconProps = {}) => (
    <I {...p}>
      <path d="M8 3 V 13 M3 8 H 13" />
    </I>
  ),
  arrowR: (p: IconProps = {}) => (
    <I {...p}>
      <path d="M3 8 H 13 M 9 4 L 13 8 L 9 12" />
    </I>
  ),
  arrowL: (p: IconProps = {}) => (
    <I {...p}>
      <path d="M13 8 H 3 M 7 4 L 3 8 L 7 12" />
    </I>
  ),
  sparkle: (p: IconProps = {}) => (
    <I {...p}>
      <path d="M8 1 L9 6 L14 7 L9 8 L8 13 L7 8 L2 7 L7 6 Z" fill="currentColor" />
      <circle cx="13" cy="3" r="0.8" fill="currentColor" />
      <circle cx="3" cy="13" r="0.6" fill="currentColor" />
    </I>
  ),
  bolt: (p: IconProps = {}) => (
    <I {...p}>
      <path d="M9 1 L3 9 L7 9 L6 15 L13 7 L8 7 L9 1 Z" fill="currentColor" />
    </I>
  ),
  bookmark: (p: IconProps = {}) => (
    <I {...p}>
      <path d="M4 2 H 12 V 14 L 8 11 L 4 14 Z" />
    </I>
  ),
  chevR: (p: IconProps = {}) => (
    <I {...p}>
      <path d="M6 3 L 11 8 L 6 13" />
    </I>
  ),
  chevL: (p: IconProps = {}) => (
    <I {...p}>
      <path d="M10 3 L 5 8 L 10 13" />
    </I>
  ),
  x: (p: IconProps = {}) => (
    <I {...p}>
      <path d="M3 3 L 13 13 M 13 3 L 3 13" />
    </I>
  ),
  youtube: (p: IconProps = {}) => (
    <I {...p}>
      <rect x="1.5" y="3" width="13" height="10" rx="2.5" />
      <path d="M7 6 L 11 8 L 7 10 Z" fill="currentColor" />
    </I>
  ),
  rewind: (p: IconProps = {}) => (
    <I {...p}>
      <path d="M13 4 L 7 8 L 13 12 Z" fill="currentColor" />
      <rect x="4" y="4" width="2" height="8" rx="0.5" fill="currentColor" />
    </I>
  ),
  home: (p: IconProps = {}) => (
    <I {...p}>
      <path d="M2 8 L 8 2 L 14 8 V 14 H 10 V 10 H 6 V 14 H 2 Z" />
    </I>
  ),
  user: (p: IconProps = {}) => (
    <I {...p}>
      <circle cx="8" cy="5.5" r="2.5" />
      <path d="M3 14 a 5 5 0 0 1 10 0" />
    </I>
  ),
};

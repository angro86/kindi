import { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';

interface VideoThumbProps {
  youtubeId?: string;
  alt?: string;
  duration?: string;
  topic?: string;
  height?: number | string;
  width?: number | string;
  badge?: ReactNode;
  progress?: number;
  radius?: number;
  fallbackGradient?: number;
  style?: CSSProperties;
}

export function VideoThumb({
  youtubeId,
  alt = '',
  duration,
  topic,
  height = 168,
  width = '100%',
  badge,
  progress,
  radius = 14,
  fallbackGradient = 1,
  style,
}: VideoThumbProps) {
  return (
    <div
      className={youtubeId ? undefined : `thumb-grad-${fallbackGradient} grain`}
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: radius,
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(40,30,20,0.06), 0 6px 16px rgba(40,30,20,0.10)',
        background: youtubeId ? 'var(--kindi-cream-3)' : undefined,
        ...style,
      }}
    >
      {youtubeId && (
        <Image
          src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
          alt={alt}
          fill
          sizes="(max-width: 768px) 50vw, 320px"
          style={{ objectFit: 'cover' }}
        />
      )}

      {topic && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            padding: '3px 9px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.92)',
            fontFamily: 'var(--kindi-body)',
            fontSize: 11,
            fontWeight: 800,
            color: 'var(--kindi-ink)',
            backdropFilter: 'blur(4px)',
            letterSpacing: '0.015em',
            boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
            zIndex: 1,
          }}
        >
          {topic}
        </div>
      )}

      {badge && (
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>{badge}</div>
      )}

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 60,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)',
          pointerEvents: 'none',
        }}
      />
      {duration && (
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            padding: '3px 8px',
            borderRadius: 6,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            fontFamily: 'var(--kindi-mono)',
            fontSize: 11,
            fontWeight: 600,
            color: '#fff',
            zIndex: 1,
          }}
        >
          {duration}
        </div>
      )}

      {progress !== undefined && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 3.5,
            background: 'rgba(255,255,255,0.25)',
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: '100%',
              background: 'oklch(0.78 0.16 30)',
            }}
          />
        </div>
      )}
    </div>
  );
}

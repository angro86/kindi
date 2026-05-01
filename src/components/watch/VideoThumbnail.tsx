'use client';

import { VideoThumbnailProps } from '@/types';
import { VideoThumb } from '@/components/ui';

const TOPIC_LABELS: Record<string, string> = {
  songs: 'Songs',
  movement: 'Move',
  social: 'Social',
  math: 'Numbers',
  reading: 'Reading',
  science: 'Science',
  stories: 'Stories',
  nature: 'Nature',
  geography: 'World',
  coding: 'Coding',
  space: 'Space',
  history: 'History',
};

export function VideoThumbnail({ video, onClick }: VideoThumbnailProps) {
  return (
    <button
      onClick={onClick}
      className="ring"
      style={{
        background: 'transparent',
        border: 'none',
        padding: 0,
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <VideoThumb
        youtubeId={video.youtubeId}
        alt={video.title}
        topic={TOPIC_LABELS[video.cat] || video.cat}
        height={138}
        radius={14}
      />
      <div style={{ padding: '0 2px' }}>
        <div
          className="t-h3"
          style={{
            fontSize: 14,
            fontWeight: 700,
            lineHeight: 1.3,
            color: 'var(--kindi-ink)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 36,
          }}
        >
          {video.title}
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--kindi-ink-soft)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {video.channel}
        </div>
      </div>
    </button>
  );
}

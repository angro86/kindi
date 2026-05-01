'use client';

import { Video } from '@/types';
import { VideoThumbnail } from './VideoThumbnail';

interface VideoGridProps {
  videos: Video[];
  onSelect: (video: Video) => void;
}

export function VideoGrid({ videos, onSelect }: VideoGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 18,
      }}
    >
      {videos.map((v) => (
        <VideoThumbnail key={v.id} video={v} onClick={() => onSelect(v)} />
      ))}
    </div>
  );
}

'use client';

import { Video } from '@/types';
import { VideoThumbnail } from './VideoThumbnail';

interface VideoGridProps {
  videos: Video[];
  onSelect: (video: Video) => void;
}

export function VideoGrid({ videos, onSelect }: VideoGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((v) => (
        <VideoThumbnail key={v.id} video={v} onClick={() => onSelect(v)} />
      ))}
    </div>
  );
}

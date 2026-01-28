'use client';

import { useState } from 'react';
import Image from 'next/image';
import { VideoThumbnailProps } from '@/types';
import { Play } from '@/components/ui/icons';

export function VideoThumbnail({ video, onClick }: VideoThumbnailProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={onClick}
      className="group text-left rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl hover:scale-105 transition-all"
    >
      <div className="relative aspect-video bg-gradient-to-br from-purple-400 to-pink-400">
        {!imgError ? (
          <Image
            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
            alt={video.title}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <span className="text-5xl">🎬</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 text-gray-700" />
          </div>
        </div>
      </div>
      <div className="p-3 bg-white">
        <h3 className="font-bold text-sm text-gray-800 line-clamp-2">{video.title}</h3>
        <p className="text-xs text-gray-500 mt-1">{video.channel}</p>
      </div>
    </button>
  );
}

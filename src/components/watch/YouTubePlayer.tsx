'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { YouTubePlayerProps } from '@/types';
import { ArrowLeft, Play, Star } from '@/components/ui/icons';
import { QUIZ_INTERVAL } from '@/lib/constants';
import { formatTime } from '@/lib/utils';

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export function YouTubePlayer({ video, onBack, onQuizTime, rewards, quizActive }: YouTubePlayerProps) {
  const [watchTime, setWatchTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastQuizRef = useRef(0);
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) return;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }, []);

  // Initialize player when API is ready
  useEffect(() => {
    const init = () => {
      if (!containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: video.youtubeId,
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
        width: '100%',
        height: '100%',
      });
    };

    if (window.YT && window.YT.Player) {
      init();
    } else {
      window.onYouTubeIframeAPIReady = init;
    }

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [video.youtubeId]);

  // Pause/resume on quiz
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    try {
      if (quizActive) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    } catch {
      // Player may not be ready yet
    }
  }, [quizActive]);

  // Pause/resume timer on quiz
  useEffect(() => {
    if (quizActive) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const startDelay = setTimeout(() => {
      timerRef.current = setInterval(() => {
        setWatchTime((prev) => {
          const newTime = prev + 1;
          if (rewards && newTime - lastQuizRef.current >= QUIZ_INTERVAL) {
            lastQuizRef.current = newTime;
            onQuizTime(newTime);
          }
          return newTime;
        });
      }, 1000);
    }, 2000);

    return () => {
      clearTimeout(startDelay);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [rewards, onQuizTime, quizActive]);

  const nextQuiz = QUIZ_INTERVAL - (watchTime - lastQuizRef.current);

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="px-4 py-2 bg-white hover:bg-gray-50 rounded-full font-medium text-gray-600 flex items-center gap-2 shadow-md"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="relative aspect-video bg-black">
          <div ref={containerRef} className="w-full h-full" />
          {rewards && nextQuiz <= 30 && nextQuiz > 0 && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg animate-pulse z-10">
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="text-white font-bold text-sm">Quiz in {nextQuiz}s!</span>
            </div>
          )}
        </div>
        <div className="p-4 flex items-center justify-between border-t bg-gray-50">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 truncate">{video.title}</h3>
            <p className="text-sm text-gray-500">{video.channel}</p>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
              <Play className="w-3 h-3" />
              {quizActive ? 'Paused' : 'Playing'}
            </div>
            <div className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-bold">
              ⏱️ {formatTime(watchTime)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

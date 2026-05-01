'use client';

import { useState, useEffect, useRef } from 'react';
import { YouTubePlayerProps } from '@/types';
import { QUIZ_INTERVAL } from '@/lib/constants';
import { formatTime } from '@/lib/utils';
import { Icon } from '@/components/ui';

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export function YouTubePlayer({ video, onQuizTime, rewards, quizActive }: YouTubePlayerProps) {
  const [watchTime, setWatchTime] = useState(0);
  const [lastQuizAt, setLastQuizAt] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onQuizTimeRef = useRef(onQuizTime);

  useEffect(() => {
    onQuizTimeRef.current = onQuizTime;
  }, [onQuizTime]);

  useEffect(() => {
    if (window.YT && window.YT.Player) return;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }, []);

  useEffect(() => {
    const init = () => {
      if (!containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: video.youtubeId,
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
        width: '100%',
        height: '100%',
        events: {
          onStateChange: (event: YT.OnStateChangeEvent) => {
            setPlaying(event.data === YT.PlayerState.PLAYING);
          },
        },
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
      // not ready
    }
  }, [quizActive]);

  useEffect(() => {
    if (!playing) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setWatchTime((prev) => {
        const newTime = prev + 1;
        setLastQuizAt((last) => {
          if (rewards && newTime - last >= QUIZ_INTERVAL) {
            onQuizTimeRef.current(newTime);
            return newTime;
          }
          return last;
        });
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, rewards]);

  const nextQuiz = QUIZ_INTERVAL - (watchTime - lastQuizAt);

  const rewind10 = () => {
    const player = playerRef.current;
    if (!player) return;
    try {
      const t = player.getCurrentTime();
      player.seekTo(Math.max(0, t - 10), true);
    } catch {
      // not ready
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        background: '#000',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--kindi-line-2)',
      }}
    >
      {/* Top chrome strip */}
      <div
        style={{
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          background: 'linear-gradient(180deg, oklch(0.22 0.02 50), oklch(0.18 0.02 50))',
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <Icon.youtube size={16} color="#fff" />
          <span style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap' }}>
            Playing on YouTube
          </span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              opacity: 0.85,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {video.channel}
          </span>
        </div>
        {rewards && nextQuiz > 0 && playing && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '3px 9px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.12)',
              fontSize: 11,
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon.sparkle size={11} color="oklch(0.85 0.16 75)" />
            Quiz in {formatTime(nextQuiz)}
          </span>
        )}
      </div>

      {/* The actual YouTube iframe — never overlay UI on top of it */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '16 / 9',
          background: '#000',
        }}
      >
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Bottom chrome strip — Kindi-only controls */}
      <div
        style={{
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          background: 'oklch(0.22 0.02 50)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={rewind10}
            style={{
              padding: '7px 12px',
              borderRadius: 9,
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Icon.rewind size={13} color="#fff" /> 10s
          </button>
          <span
            style={{
              padding: '7px 12px',
              borderRadius: 9,
              background: 'rgba(255,255,255,0.05)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: 'var(--kindi-mono)',
            }}
          >
            <Icon.clock size={13} color="#fff" /> {formatTime(watchTime)}
          </span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.7 }}>
          {playing ? 'Playing' : 'Paused'} · Kindi controls
        </div>
      </div>
    </div>
  );
}

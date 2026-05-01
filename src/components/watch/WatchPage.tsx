'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { WatchPageProps, Video, QuizQuestion } from '@/types';
import { VIDEOS } from '@/data/videos';
import { CATEGORIES } from '@/data/categories';
import { QUESTIONS } from '@/data/questions';
import { VIDEO_QUESTIONS } from '@/data/generated-questions';
import { QUIZ_INTERVAL } from '@/lib/constants';
import { formatTime, getFilteredVideos } from '@/lib/utils';
import { VideoGrid } from './VideoGrid';
import { YouTubePlayer } from './YouTubePlayer';
import { QuestionModal } from '@/components/modals/QuestionModal';
import { JarFullModal } from '@/components/modals/JarFullModal';
import { TimeUpModal } from '@/components/modals/TimeUpModal';
import { Button, Chip, Icon, KindiAvatar, KindiLogo, Pill } from '@/components/ui';

export function WatchPage({ child, duration, categories, rewards, onEnd }: WatchPageProps) {
  const [video, setVideo] = useState<Video | null>(null);
  const [timeUp, setTimeUp] = useState(false);
  const [active, setActive] = useState<string[]>(categories);
  const [stars, setStars] = useState(0);
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [jarFull, setJarFull] = useState(false);
  const [sessionTime, setSessionTime] = useState(duration * 60);
  const [search, setSearch] = useState('');

  const ageGroup = child.age <= 3 ? 2 : child.age <= 5 ? 4 : 6;
  const allCats = CATEGORIES[ageGroup];
  const availCats = categories.map((k) => [k, allCats[k]] as [string, string]);

  const filteredVideos = useMemo(() => {
    return getFilteredVideos(VIDEOS, ageGroup, active, search);
  }, [ageGroup, active, search]);

  const questions = QUESTIONS[ageGroup as 2 | 4 | 6];

  useEffect(() => {
    const t = setInterval(() => {
      setSessionTime((p) => {
        if (p <= 1) {
          clearInterval(t);
          setTimeUp(true);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const onQuizTime = useCallback(
    (watchTime: number) => {
      if (!rewards.enabled || !video) return;
      const videoQs = VIDEO_QUESTIONS[video.youtubeId];
      const chunkStart = watchTime - QUIZ_INTERVAL;
      if (videoQs) {
        const match = videoQs.find((tq) => tq.startSec >= chunkStart && tq.startSec < watchTime);
        if (match) {
          setQuestion(match.question);
          return;
        }
      }
      setQuestion(questions[Math.floor(Math.random() * questions.length)]);
    },
    [rewards.enabled, video, questions],
  );

  const onAnswer = (correct: boolean) => {
    setQuestion(null);
    if (correct) {
      const n = stars + 1;
      setStars(n);
      if (n >= rewards.goal) {
        setTimeout(() => setJarFull(true), 500);
      }
    }
  };

  const upNext = video ? filteredVideos.filter((v) => v.id !== video.id).slice(0, 6) : [];

  return (
    <div
      className="kindi-body"
      style={{
        minHeight: '100vh',
        background: 'var(--kindi-cream)',
      }}
    >
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(252, 250, 246, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--kindi-line)',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <KindiLogo size={18} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Pill icon={<Icon.clock size={11} color="var(--kindi-coral-deep)" />}>
              <span className="t-mono" style={{ fontWeight: 700 }}>
                {formatTime(sessionTime)}
              </span>
            </Pill>
            {rewards.enabled && (
              <Pill
                color="oklch(0.94 0.10 90)"
                icon={<Icon.star size={11} color="oklch(0.65 0.18 75)" />}
              >
                {stars}/{rewards.goal}
              </Pill>
            )}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 10px 4px 4px',
                borderRadius: 999,
                background: 'var(--kindi-paper)',
                border: '1px solid var(--kindi-line-2)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <KindiAvatar avatarIndex={child.avatar || 0} size={28} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>{child.name}</span>
            </div>
            <Button variant="secondary" size="sm" onClick={onEnd}>
              End
            </Button>
          </div>
        </div>
      </header>

      {!video ? (
        <GridView
          child={child}
          sessionTime={sessionTime}
          search={search}
          setSearch={setSearch}
          availCats={availCats}
          active={active}
          setActive={setActive}
          filteredVideos={filteredVideos}
          onSelect={setVideo}
        />
      ) : (
        <PlayerView
          video={video}
          upNext={upNext}
          onBack={() => setVideo(null)}
          onSelect={setVideo}
          onQuizTime={onQuizTime}
          rewards={rewards.enabled}
          quizActive={!!question}
        />
      )}

      {question && <QuestionModal question={question} onAnswer={onAnswer} />}
      {jarFull && (
        <JarFullModal
          name={child.name}
          onClaim={() => {
            setJarFull(false);
            setStars(0);
          }}
        />
      )}
      {timeUp && <TimeUpModal name={child.name} duration={duration} onEnd={onEnd} />}
    </div>
  );
}

function GridView({
  child,
  sessionTime,
  search,
  setSearch,
  availCats,
  active,
  setActive,
  filteredVideos,
  onSelect,
}: {
  child: WatchPageProps['child'];
  sessionTime: number;
  search: string;
  setSearch: (s: string) => void;
  availCats: [string, string][];
  active: string[];
  setActive: React.Dispatch<React.SetStateAction<string[]>>;
  filteredVideos: Video[];
  onSelect: (v: Video) => void;
}) {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();
  const minutesLeft = Math.ceil(sessionTime / 60);

  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px 48px' }}>
      {/* Greeting block */}
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <KindiAvatar avatarIndex={child.avatar || 0} size={56} />
          <div>
            <div className="t-label">{greeting}</div>
            <div
              className="kindi-display"
              style={{
                fontSize: 32,
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: '-0.025em',
              }}
            >
              Hi, <span className="squig">{child.name}</span>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            borderRadius: 999,
            background: 'var(--kindi-paper)',
            border: '1px solid var(--kindi-line-2)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <Icon.clock size={15} color="var(--kindi-coral-deep)" />
          <span className="t-mono" style={{ fontWeight: 700, fontSize: 13 }}>
            {minutesLeft} min left
          </span>
        </div>
      </section>

      {/* Search + chips */}
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: '0 0 280px', maxWidth: '100%' }}>
          <span
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--kindi-ink-mute)',
              display: 'flex',
            }}
          >
            <Icon.search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 14px 9px 34px',
              borderRadius: 999,
              border: '1px solid var(--kindi-line-2)',
              background: 'var(--kindi-paper)',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'var(--kindi-body)',
              outline: 'none',
              boxShadow: 'var(--shadow-xs)',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }} className="no-scrollbar">
          {availCats.map(([k, l]) => {
            const emoji = l.split(' ')[0];
            const label = l.split(' ').slice(1).join(' ');
            return (
              <Chip
                key={k}
                active={active.includes(k)}
                onClick={() =>
                  setActive((p) => (p.includes(k) ? p.filter((c) => c !== k) : [...p, k]))
                }
              >
                <span style={{ fontSize: 14 }}>{emoji}</span>
                {label}
              </Chip>
            );
          })}
        </div>
      </section>

      {/* Video grid */}
      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <h2
            className="kindi-display"
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '-0.022em',
            }}
          >
            {filteredVideos.length} videos to explore
          </h2>
        </div>

        {filteredVideos.length === 0 ? (
          <div
            className="surface"
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              borderRadius: 20,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 8 }}>🔍</div>
            <p style={{ color: 'var(--kindi-ink-soft)', fontWeight: 600 }}>
              {search ? 'No videos match your search' : 'Pick a topic above'}
            </p>
          </div>
        ) : (
          <VideoGrid videos={filteredVideos} onSelect={onSelect} />
        )}
      </section>
    </main>
  );
}

function PlayerView({
  video,
  upNext,
  onBack,
  onSelect,
  onQuizTime,
  rewards,
  quizActive,
}: {
  video: Video;
  upNext: Video[];
  onBack: () => void;
  onSelect: (v: Video) => void;
  onQuizTime: (watchTime: number) => void;
  rewards: boolean;
  quizActive: boolean;
}) {
  return (
    <main
      style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '20px 24px 48px',
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <Button variant="secondary" size="sm" icon={<Icon.arrowL size={13} />} onClick={onBack}>
          Back
        </Button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 320px',
          gap: 24,
          alignItems: 'start',
        }}
        className="watch-grid"
      >
        <div>
          <YouTubePlayer
            video={video}
            onBack={onBack}
            onQuizTime={onQuizTime}
            rewards={rewards}
            quizActive={quizActive}
          />
          <div style={{ marginTop: 18 }}>
            <h1 className="t-h1" style={{ margin: 0 }}>
              {video.title}
            </h1>
            <div
              style={{
                marginTop: 8,
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--kindi-ink-soft)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span>{video.channel}</span>
              <span style={{ opacity: 0.5 }}>•</span>
              <span>
                Ages {video.ageMin}–{video.ageMax}
              </span>
            </div>
          </div>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {upNext.length > 0 && (
            <div className="surface" style={{ padding: 16, borderRadius: 18 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <div className="t-label">Up next</div>
                <span
                  className="t-caption"
                  style={{ color: 'var(--kindi-ink-soft)' }}
                >
                  {upNext.length} approved
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {upNext.map((v) => (
                  <UpNextRow key={v.id} video={v} onClick={() => onSelect(v)} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .watch-grid {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }
      `}</style>
    </main>
  );
}

function UpNextRow({ video, onClick }: { video: Video; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <div style={{ width: 100, flexShrink: 0 }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: 8,
            overflow: 'hidden',
            background: 'var(--kindi-cream-3)',
            boxShadow: '0 1px 2px rgba(40,30,20,0.06)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
            alt={video.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            lineHeight: 1.25,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {video.title}
        </div>
        <div
          style={{
            marginTop: 2,
            fontSize: 11.5,
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

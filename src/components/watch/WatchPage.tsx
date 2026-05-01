'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { WatchPageProps, Video, QuizQuestion } from '@/types';
import { VIDEOS } from '@/data/videos';
import { CATEGORIES } from '@/data/categories';
import { QUESTIONS } from '@/data/questions';
import { VIDEO_QUESTIONS } from '@/data/generated-questions';
import { QUIZ_INTERVAL } from '@/lib/constants';
import { formatTime, getFilteredVideos } from '@/lib/utils';
import { storage, WatchEvent } from '@/lib/storage';
import { newlyUnlocked, Sticker, stickersUnlockedFor } from '@/lib/stickers';
import { VideoGrid } from './VideoGrid';
import { YouTubePlayer } from './YouTubePlayer';
import { QuestionModal } from '@/components/modals/QuestionModal';
import { JarFullModal } from '@/components/modals/JarFullModal';
import { TimeUpModal } from '@/components/modals/TimeUpModal';
import { StickerUnlockModal } from '@/components/modals/StickerUnlockModal';
import { Button, Chip, Icon, KindiAvatar, KindiLogo, Pill } from '@/components/ui';
import { AchievementsScreen } from '@/components/screens/AchievementsScreen';
import { BrowseScreen } from '@/components/screens/BrowseScreen';

type View = 'home' | 'browse' | 'achievements';

export function WatchPage({ child, duration, categories, rewards, onEnd }: WatchPageProps) {
  const [video, setVideo] = useState<Video | null>(null);
  const [view, setView] = useState<View>('home');
  const [timeUp, setTimeUp] = useState(false);
  const [active, setActive] = useState<string[]>(categories);
  const [sessionStars, setSessionStars] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [unlockedStickers, setUnlockedStickers] = useState<string[]>([]);
  const [history, setHistory] = useState<WatchEvent[]>([]);
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [jarFull, setJarFull] = useState(false);
  const [pendingSticker, setPendingSticker] = useState<Sticker | null>(null);
  const [sessionTime, setSessionTime] = useState(duration * 60);
  const [search, setSearch] = useState('');

  const ageGroup = child.age <= 3 ? 2 : child.age <= 5 ? 4 : 6;
  const allCats = CATEGORIES[ageGroup];
  const availCats = categories.map((k) => [k, allCats[k]] as [string, string]);

  const filteredVideos = useMemo(() => {
    return getFilteredVideos(VIDEOS, ageGroup, active, search);
  }, [ageGroup, active, search]);

  const browseVideos = useMemo(() => {
    return search
      ? VIDEOS.filter(
          (v) =>
            ageGroup >= v.ageMin &&
            ageGroup <= v.ageMax &&
            v.title.toLowerCase().includes(search.toLowerCase()),
        )
      : [];
  }, [ageGroup, search]);

  const videosPerCat = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const v of VIDEOS) {
      if (ageGroup < v.ageMin || ageGroup > v.ageMax) continue;
      counts[v.cat] = (counts[v.cat] || 0) + 1;
    }
    return counts;
  }, [ageGroup]);

  const continueWatching = useMemo(() => {
    if (!history.length) return [];
    const ids = new Set(history.map((h) => h.videoId));
    const lookup = new Map(VIDEOS.filter((v) => ids.has(v.id)).map((v) => [v.id, v]));
    return history.map((h) => lookup.get(h.videoId)).filter((v): v is Video => !!v).slice(0, 6);
  }, [history]);

  const questions = QUESTIONS[ageGroup as 2 | 4 | 6];

  // hydrate persistent state
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setTotalStars(storage.getStars(child.id));
    setUnlockedStickers(storage.getStickers(child.id));
    setHistory(storage.getHistory(child.id));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [child.id]);

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
    if (!correct) return;

    const nextSession = sessionStars + 1;
    setSessionStars(nextSession);

    const nextTotal = storage.addStars(child.id, 1);
    setTotalStars(nextTotal);

    const justUnlocked = newlyUnlocked(nextTotal - 1, nextTotal);
    if (justUnlocked.length > 0) {
      const sticker = justUnlocked[0];
      storage.unlockSticker(child.id, sticker.id);
      setUnlockedStickers(stickersUnlockedFor(nextTotal));
      setTimeout(() => setPendingSticker(sticker), 600);
    } else if (nextSession >= rewards.goal) {
      setTimeout(() => setJarFull(true), 500);
    }
  };

  const onSelectVideo = (v: Video) => {
    setVideo(v);
    const event: WatchEvent = {
      videoId: v.id,
      youtubeId: v.youtubeId,
      title: v.title,
      channel: v.channel,
      watchedAt: Date.now(),
    };
    const next = storage.recordWatch(child.id, event);
    setHistory(next);
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
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <KindiLogo size={18} />
            {!video && (
              <nav style={{ display: 'flex', gap: 4 }}>
                <NavTab active={view === 'home'} onClick={() => setView('home')}>
                  Home
                </NavTab>
                <NavTab active={view === 'browse'} onClick={() => setView('browse')}>
                  Browse
                </NavTab>
                <NavTab
                  active={view === 'achievements'}
                  onClick={() => setView('achievements')}
                >
                  Stickers
                </NavTab>
              </nav>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Pill icon={<Icon.clock size={11} color="var(--kindi-coral-deep)" />}>
              <span className="t-mono" style={{ fontWeight: 700 }}>
                {formatTime(sessionTime)}
              </span>
            </Pill>
            <Pill
              color="oklch(0.94 0.10 90)"
              icon={<Icon.star size={11} color="oklch(0.65 0.18 75)" />}
            >
              {totalStars}
            </Pill>
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

      {video ? (
        <PlayerView
          video={video}
          upNext={upNext}
          onBack={() => setVideo(null)}
          onSelect={onSelectVideo}
          onQuizTime={onQuizTime}
          rewards={rewards.enabled}
          quizActive={!!question}
        />
      ) : view === 'browse' ? (
        <BrowseScreen
          search={search}
          setSearch={setSearch}
          availCats={availCats}
          active={active}
          setActive={setActive}
          filteredVideos={browseVideos}
          videosPerCat={videosPerCat}
          onSelect={onSelectVideo}
        />
      ) : view === 'achievements' ? (
        <AchievementsScreen
          childName={child.name}
          totalStars={totalStars}
          unlockedIds={unlockedStickers}
        />
      ) : (
        <HomeView
          child={child}
          sessionTime={sessionTime}
          search={search}
          setSearch={setSearch}
          availCats={availCats}
          active={active}
          setActive={setActive}
          filteredVideos={filteredVideos}
          continueWatching={continueWatching}
          onSelect={onSelectVideo}
        />
      )}

      {question && <QuestionModal question={question} onAnswer={onAnswer} />}
      {pendingSticker && (
        <StickerUnlockModal
          childName={child.name}
          sticker={pendingSticker}
          totalStars={totalStars}
          onContinue={() => setPendingSticker(null)}
        />
      )}
      {jarFull && (
        <JarFullModal
          name={child.name}
          onClaim={() => {
            setJarFull(false);
            setSessionStars(0);
          }}
        />
      )}
      {timeUp && <TimeUpModal name={child.name} duration={duration} onEnd={onEnd} />}
    </div>
  );
}

function NavTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: 8,
        background: active ? 'var(--kindi-cream-2)' : 'transparent',
        border: 'none',
        fontFamily: 'var(--kindi-body)',
        fontSize: 13,
        fontWeight: 700,
        color: active ? 'var(--kindi-ink)' : 'var(--kindi-ink-soft)',
        cursor: 'pointer',
        transition: 'all .12s',
      }}
    >
      {children}
    </button>
  );
}

function HomeView({
  child,
  sessionTime,
  search,
  setSearch,
  availCats,
  active,
  setActive,
  filteredVideos,
  continueWatching,
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
  continueWatching: Video[];
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

      {!search && continueWatching.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2
            className="kindi-display"
            style={{
              margin: '0 0 12px',
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '-0.022em',
            }}
          >
            Pick up where you left off
          </h2>
          <div
            className="no-scrollbar"
            style={{
              display: 'flex',
              gap: 14,
              overflowX: 'auto',
              paddingBottom: 4,
            }}
          >
            {continueWatching.map((v) => (
              <div key={v.id} style={{ flex: '0 0 240px' }}>
                <ContinueCard video={v} onSelect={onSelect} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2
          className="kindi-display"
          style={{
            margin: '0 0 16px',
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '-0.022em',
          }}
        >
          {filteredVideos.length}{' '}
          {search
            ? `result${filteredVideos.length === 1 ? '' : 's'}`
            : 'videos to explore'}
        </h2>
        {filteredVideos.length === 0 ? (
          <div
            className="surface"
            style={{ padding: '48px 24px', textAlign: 'center', borderRadius: 20 }}
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

function ContinueCard({ video, onSelect }: { video: Video; onSelect: (v: Video) => void }) {
  return (
    <button
      onClick={() => onSelect(video)}
      className="ring"
      style={{
        background: 'var(--kindi-paper)',
        border: '1px solid var(--kindi-line)',
        borderRadius: 14,
        padding: 0,
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        width: '100%',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          background: 'var(--kindi-cream-3)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
          alt={video.title}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
      <div style={{ padding: 12 }}>
        <div
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

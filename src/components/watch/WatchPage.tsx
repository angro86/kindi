'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { WatchPageProps, Video, QuizQuestion } from '@/types';
import { Clock, Star, Search } from '@/components/ui/icons';
import { avatars } from '@/components/avatars';
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
  const Avatar = avatars[child.avatar || 0];

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

  const [quizLoading, setQuizLoading] = useState(false);
  const videoRef = useRef(video);
  videoRef.current = video;

  const onQuizTime = useCallback(async (watchTime: number, videoTime: number) => {
    const currentVideo = videoRef.current;
    if (!rewards.enabled || !currentVideo) return;

    // Try transcript-based quiz generation via API
    // Use videoTime (actual playback position in current video) not cumulative watchTime
    setQuizLoading(true);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: currentVideo.youtubeId,
          videoTitle: currentVideo.title,
          videoChannel: currentVideo.channel,
          age: child.age,
          watchedSeconds: videoTime,
        }),
      });

      if (res.ok) {
        const q = await res.json();
        if (q.q && q.answers && typeof q.correct === 'number') {
          setQuizLoading(false);
          setQuestion(q);
          return;
        }
      }
    } catch (e) {
      console.log('Transcript quiz failed, using fallback:', e);
    }

    setQuizLoading(false);

    // Fallback: video-specific pre-generated questions
    const videoQs = VIDEO_QUESTIONS[currentVideo.youtubeId];
    const chunkStart = watchTime - QUIZ_INTERVAL;

    if (videoQs) {
      const match = videoQs.find((tq) => tq.startSec >= chunkStart && tq.startSec < watchTime);
      if (match) {
        setQuestion(match.question);
        return;
      }
    }

    // Final fallback: static age-group questions
    setQuestion(questions[Math.floor(Math.random() * questions.length)]);
  }, [rewards.enabled, questions, child.age]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-50">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-lg">🦊</span>
            </div>
            <span className="text-lg font-bold text-white">kindi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-white" />
              <span className="font-bold text-white">{formatTime(sessionTime)}</span>
            </div>
            {rewards.enabled && (
              <div className="bg-amber-400 rounded-full px-3 py-1.5 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-900" />
                <span className="font-bold text-amber-900">
                  {stars}/{rewards.goal}
                </span>
              </div>
            )}
            <div className="bg-white/20 rounded-full pl-1 pr-3 py-1 flex items-center gap-1.5">
              <Avatar size={26} />
              <span className="text-white font-medium text-sm">{child.name}</span>
            </div>
            <button
              onClick={onEnd}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full font-medium text-white text-sm"
            >
              End
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/80 border-b sticky top-14 z-30">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search videos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              {availCats.map(([k, l]) => (
                <button
                  key={k}
                  onClick={() =>
                    setActive((p) => (p.includes(k) ? p.filter((c) => c !== k) : [...p, k]))
                  }
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${active.includes(k) ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-white text-gray-600 border'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {!video ? (
          <>
            <h1 className="text-xl font-bold text-indigo-900 mb-4">
              {filteredVideos.length} videos to explore! 🎉
            </h1>
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500">
                  {search ? 'No videos match your search' : 'Select a category'}
                </p>
              </div>
            ) : (
              <VideoGrid videos={filteredVideos} onSelect={setVideo} />
            )}
          </>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            <YouTubePlayer
              video={video}
              onBack={() => setVideo(null)}
              onQuizTime={onQuizTime}
              rewards={rewards.enabled}
              quizActive={!!question || quizLoading}
            />
            {filteredVideos.filter((v) => v.id !== video.id).length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Up Next 🎬</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {filteredVideos
                    .filter((v) => v.id !== video.id)
                    .slice(0, 4)
                    .map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setVideo(v)}
                        className="rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:scale-105 transition-all"
                      >
                        <div className="aspect-video bg-gray-200">
                          <img
                            src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                          />
                        </div>
                        <div className="p-2 bg-white">
                          <p className="text-xs font-medium text-gray-700 truncate">{v.title}</p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {quizLoading && (
        <div className="fixed inset-0 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center z-50 p-4">
          <div className="text-center">
            <div className="text-8xl mb-6 animate-bounce">🌟</div>
            <h2 className="text-3xl font-bold text-white">Get ready...</h2>
          </div>
        </div>
      )}
      {question && <QuestionModal question={question} onAnswer={onAnswer} />}
      {jarFull && <JarFullModal name={child.name} onClaim={() => { setJarFull(false); setStars(0); }} />}
      {timeUp && <TimeUpModal name={child.name} duration={duration} onEnd={onEnd} />}
    </div>
  );
}

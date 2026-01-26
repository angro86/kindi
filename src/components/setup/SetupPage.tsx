'use client';

import { useState } from 'react';
import { SetupPageProps, ChildProfile, SessionDuration, RewardSettings } from '@/types';
import { Clock, Plus, Star } from '@/components/ui/icons';
import { avatars } from '@/components/avatars';
import { ChildModal } from '@/components/modals/ChildModal';
import { VIDEOS } from '@/data/videos';
import { CATEGORIES } from '@/data/categories';

export function SetupPage({ kids, onStart, onAdd }: SetupPageProps) {
  const [step, setStep] = useState(1);
  const [sel, setSel] = useState<ChildProfile | null>(null);
  const [dur, setDur] = useState<SessionDuration>(30);
  const [cats, setCats] = useState<string[]>([]);
  const [modal, setModal] = useState(false);
  const [rewards, setRewards] = useState(true);
  const [goal, setGoal] = useState<3 | 5 | 10>(5);

  const ageGroup = sel ? (sel.age <= 3 ? 2 : sel.age <= 5 ? 4 : 6) : null;
  const avail = ageGroup ? Object.entries(CATEGORIES[ageGroup]) : [];
  const videoCount = ageGroup ? VIDEOS.filter((v) => v.age === ageGroup).length : 0;

  const canGo = () => (step === 1 ? sel : step === 2 ? cats.length > 0 : true);

  const next = () => {
    if (step === 3 && sel) {
      const rewardSettings: RewardSettings = { enabled: rewards, goal };
      onStart(sel, dur, cats, rewardSettings);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 flex flex-col relative overflow-hidden">
      <div className="relative z-10 px-6 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-xl">🦊</span>
          </div>
          <span className="text-xl font-bold text-white">kindi</span>
          <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs text-white/80">
            {VIDEOS.length} videos
          </span>
        </div>
        <button
          onClick={() => setModal(true)}
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-6 max-w-xl mx-auto w-full">
        {step === 1 && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Who&apos;s watching?</h1>
            <p className="text-white/70 mb-10">Tap to choose</p>
            <div className="flex justify-center gap-6 flex-wrap">
              {kids.map((k) => {
                const Avatar = avatars[k.avatar || 0];
                return (
                  <button
                    key={k.id}
                    onClick={() => {
                      setSel(k);
                      setCats([]);
                    }}
                    className={`relative transition-all ${sel?.id === k.id ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <div
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center ${sel?.id === k.id ? 'bg-white shadow-xl' : 'bg-white/20'}`}
                    >
                      <Avatar size={50} happy={sel?.id === k.id} />
                    </div>
                    <p
                      className={`mt-3 font-semibold ${sel?.id === k.id ? 'text-white' : 'text-white/70'}`}
                    >
                      {k.name}
                    </p>
                    <p className={`text-sm ${sel?.id === k.id ? 'text-white/80' : 'text-white/50'}`}>
                      {k.age} years
                    </p>
                  </button>
                );
              })}
            </div>
            {sel && (
              <p className="text-white/60 mt-8 text-sm">
                {videoCount} videos for age {sel.age}
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Pick adventures</h1>
            <p className="text-white/70 mb-8">What sounds fun?</p>
            <div className="grid grid-cols-3 gap-3">
              {avail.map(([k, l]) => {
                const isSel = cats.includes(k);
                const count = VIDEOS.filter((v) => v.age === ageGroup && v.cat === k).length;
                return (
                  <button
                    key={k}
                    onClick={() =>
                      setCats((p) => (p.includes(k) ? p.filter((c) => c !== k) : [...p, k]))
                    }
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${isSel ? 'bg-white shadow-xl scale-105' : 'bg-white/20 hover:bg-white/30'}`}
                  >
                    <span className="text-2xl mb-1">{l.split(' ')[0]}</span>
                    <span className={`text-xs font-semibold ${isSel ? 'text-indigo-600' : 'text-white'}`}>
                      {l.split(' ').slice(1).join(' ')}
                    </span>
                    <span className={`text-xs mt-1 ${isSel ? 'text-gray-500' : 'text-white/60'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Set it up</h1>
            <div className="bg-white/20 rounded-2xl p-5 mb-4">
              <p className="text-white/80 text-sm mb-3">
                <Clock className="w-4 h-4 inline mr-2" />
                Duration
              </p>
              <div className="flex gap-2">
                {([15, 30, 45, 60] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setDur(m)}
                    className={`flex-1 py-3 rounded-xl font-bold ${dur === m ? 'bg-white text-indigo-600' : 'bg-white/20 text-white'}`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white/20 rounded-2xl p-5 mb-4">
              <button
                onClick={() => setRewards(!rewards)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full mx-auto mb-3 ${rewards ? 'bg-amber-400 text-amber-900' : 'bg-white/20 text-white'}`}
              >
                <Star className="w-4 h-4" />
                <span className="font-bold text-sm">Star Rewards</span>
              </button>
              {rewards && (
                <>
                  <p className="text-white/80 text-sm mb-3">Stars for bonus</p>
                  <div className="flex gap-2">
                    {([3, 5, 10] as const).map((n) => (
                      <button
                        key={n}
                        onClick={() => setGoal(n)}
                        className={`flex-1 py-3 rounded-xl font-bold ${goal === n ? 'bg-amber-400 text-amber-900' : 'bg-white/20 text-white'}`}
                      >
                        {n} ⭐
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 px-6 pb-8 max-w-xl mx-auto w-full">
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => s < step && setStep(s)}
              className={`h-2 rounded-full ${step === s ? 'w-8 bg-white' : s < step ? 'w-2 bg-white/60' : 'w-2 bg-white/30'}`}
            />
          ))}
        </div>
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-4 bg-white/20 text-white font-bold rounded-2xl"
            >
              Back
            </button>
          )}
          <button
            onClick={next}
            disabled={!canGo()}
            className="flex-1 py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-xl disabled:opacity-50"
          >
            {step === 3 ? "Let's Go! 🚀" : 'Next'}
          </button>
        </div>
      </div>

      {modal && <ChildModal onSave={onAdd} onClose={() => setModal(false)} />}
    </div>
  );
}

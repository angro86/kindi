'use client';

import { JarFullModalProps } from '@/types';

export function JarFullModal({ name, onClaim }: JarFullModalProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center z-50 p-4">
      <div className="text-center">
        <div className="text-9xl mb-4">🎉</div>
        <h2 className="text-4xl font-bold text-white mb-3">Bonus Unlocked!</h2>
        <p className="text-2xl text-white/90 mb-8">Way to go, {name}!</p>
        <button
          onClick={onClaim}
          className="px-10 py-5 bg-white text-orange-500 font-bold text-xl rounded-2xl shadow-xl hover:scale-105 transition-transform"
        >
          🎬 Pick a bonus!
        </button>
      </div>
    </div>
  );
}

'use client';

import { Trophy } from '@/components/ui/icons';

interface TimeUpModalProps {
  name: string;
  duration: number;
  onEnd: () => void;
}

export function TimeUpModal({ name, duration, onEnd }: TimeUpModalProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-amber-500 to-rose-500 flex items-center justify-center z-50 p-4">
      <div className="text-center">
        <Trophy className="w-20 h-20 text-white mx-auto mb-4" />
        <h2 className="text-4xl font-bold text-white mb-3">Time&apos;s up! 🎉</h2>
        <p className="text-2xl text-white/90 mb-6">
          {name} had {duration} min of fun!
        </p>
        <button
          onClick={onEnd}
          className="px-10 py-4 bg-white text-orange-500 font-bold text-xl rounded-2xl shadow-xl hover:scale-105"
        >
          All Done! ✨
        </button>
      </div>
    </div>
  );
}

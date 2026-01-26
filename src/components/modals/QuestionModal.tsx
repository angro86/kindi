'use client';

import { useState, useEffect } from 'react';
import { QuestionModalProps } from '@/types';
import { Volume2 } from '@/components/ui/icons';
import { useSpeech } from '@/hooks/useSpeech';

export function QuestionModal({ question, onAnswer }: QuestionModalProps) {
  const [sel, setSel] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const { speak } = useSpeech();

  useEffect(() => {
    speak(question.q);
  }, [question.q, speak]);

  const pick = (i: number) => {
    setSel(i);
    setDone(true);
    speak(i === question.correct ? "That's right!" : 'Good try!');
    setTimeout(() => onAnswer(i === question.correct), 2000);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center z-50 p-4">
      <div className="max-w-lg w-full text-center">
        {!done ? (
          <>
            <div className="text-8xl mb-6">{question.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-6">{question.q}</h2>
            <button
              onClick={() => speak(question.q)}
              className="px-5 py-2 bg-white/20 rounded-full text-white mb-8"
            >
              <Volume2 className="w-5 h-5 inline mr-2" />
              Read to me
            </button>
            <div className="space-y-3">
              {question.answers.map((a, i) => (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  className="w-full py-4 rounded-2xl bg-white/20 hover:bg-white text-white hover:text-indigo-600 text-xl font-bold transition-all"
                >
                  {a}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-9xl mb-6">{sel === question.correct ? '⭐' : '😅'}</div>
            <h2 className="text-4xl font-bold text-white">
              {sel === question.correct ? 'You got it!' : 'So close!'}
            </h2>
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { QuestionModalProps } from '@/types';
import { useSpeech } from '@/hooks/useSpeech';
import { Button, Icon, KindiBlob, Pill } from '@/components/ui';

export function QuestionModal({ question, onAnswer }: QuestionModalProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const { speak } = useSpeech();
  const reveal = picked !== null;
  const correct = picked === question.correct;

  useEffect(() => {
    speak(question.q);
  }, [question.q, speak]);

  useEffect(() => {
    if (picked === null) return;
    speak(correct ? "That's right!" : 'Good try!');
    const t = setTimeout(() => onAnswer(correct), 1800);
    return () => clearTimeout(t);
  }, [picked, correct, onAnswer, speak]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20,15,10,0.55)',
        backdropFilter: 'blur(8px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 560,
          background: 'var(--kindi-cream)',
          borderRadius: 24,
          padding: 32,
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--kindi-line)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <KindiBlob color="var(--kindi-butter-mid)" size={48} mood="wow" />
          <div style={{ flex: 1 }}>
            <div className="t-label">Quick quiz</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--kindi-ink-soft)' }}>
              Earn a star!
            </div>
          </div>
          <Pill
            color="oklch(0.92 0.13 90)"
            tone="soft"
            icon={<Icon.star size={11} color="oklch(0.78 0.16 75)" />}
          >
            +1
          </Pill>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 4 }}>
          <span style={{ fontSize: 36, lineHeight: 1 }}>{question.emoji}</span>
          <h2
            className="kindi-display"
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              flex: 1,
            }}
          >
            {question.q}
          </h2>
        </div>

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {question.answers.map((a, i) => {
            const isPicked = picked === i;
            const isCorrect = i === question.correct;
            const bg = !reveal
              ? 'var(--kindi-paper)'
              : isCorrect
                ? 'oklch(0.92 0.10 150)'
                : isPicked
                  ? 'oklch(0.92 0.08 30)'
                  : 'var(--kindi-paper)';
            const border = !reveal
              ? 'var(--kindi-line-2)'
              : isCorrect
                ? 'oklch(0.55 0.15 150)'
                : isPicked
                  ? 'var(--kindi-coral-deep)'
                  : 'var(--kindi-line-2)';
            const dotBg = !reveal
              ? 'var(--kindi-cream-3)'
              : isCorrect
                ? 'oklch(0.55 0.15 150)'
                : isPicked
                  ? 'var(--kindi-coral-deep)'
                  : 'var(--kindi-cream-3)';
            const dotFg = !reveal
              ? 'var(--kindi-ink)'
              : isCorrect || isPicked
                ? '#fff'
                : 'var(--kindi-ink)';
            return (
              <button
                key={i}
                onClick={() => picked === null && setPicked(i)}
                disabled={picked !== null}
                style={{
                  padding: '14px 16px',
                  borderRadius: 14,
                  background: bg,
                  border: `2px solid ${border}`,
                  fontSize: 15,
                  fontWeight: 700,
                  color: 'var(--kindi-ink)',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontFamily: 'var(--kindi-body)',
                  boxShadow:
                    reveal && isCorrect
                      ? '0 4px 14px oklch(0.6 0.13 150 / 0.3)'
                      : 'var(--shadow-xs)',
                  cursor: picked === null ? 'pointer' : 'default',
                  transition: 'all .14s',
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    flexShrink: 0,
                    background: dotBg,
                    color: dotFg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                    fontFamily: 'var(--kindi-display)',
                  }}
                >
                  {reveal && isCorrect ? (
                    <Icon.check size={14} color="#fff" />
                  ) : reveal && isPicked ? (
                    <Icon.x size={12} color="#fff" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span style={{ flex: 1, lineHeight: 1.35 }}>{a}</span>
              </button>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <button
            onClick={() => speak(question.q)}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--kindi-ink-soft)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Icon.sparkle size={14} color="var(--kindi-coral-deep)" /> Read to me
          </button>
          {reveal && (
            <Button
              variant="primary"
              size="md"
              onClick={() => onAnswer(correct)}
              iconRight={<Icon.arrowR size={14} color="#fff" />}
            >
              Keep watching
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

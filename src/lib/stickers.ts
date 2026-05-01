export type StickerMood = 'happy' | 'wow' | 'wink' | 'sleepy';

export interface Sticker {
  id: string;
  name: string;
  rule: string;
  threshold: number;
  color: string;
  mood: StickerMood;
}

export const STICKERS: Sticker[] = [
  {
    id: 'first-spark',
    name: 'First Spark',
    rule: 'Earn 5 stars',
    threshold: 5,
    color: 'var(--kindi-coral)',
    mood: 'wow',
  },
  {
    id: 'curious-cookie',
    name: 'Curious Cookie',
    rule: 'Earn 15 stars',
    threshold: 15,
    color: 'var(--kindi-mint-mid)',
    mood: 'happy',
  },
  {
    id: 'story-sprout',
    name: 'Story Sprout',
    rule: 'Earn 30 stars',
    threshold: 30,
    color: 'var(--kindi-butter-mid)',
    mood: 'wink',
  },
  {
    id: 'maker-bee',
    name: 'Maker Bee',
    rule: 'Earn 60 stars',
    threshold: 60,
    color: 'var(--kindi-lilac-mid)',
    mood: 'happy',
  },
  {
    id: 'big-word-wizard',
    name: 'Big Word Wizard',
    rule: 'Earn 100 stars',
    threshold: 100,
    color: 'var(--kindi-sky-mid)',
    mood: 'wow',
  },
  {
    id: 'globe-trotter',
    name: 'Globe Trotter',
    rule: 'Earn 175 stars',
    threshold: 175,
    color: 'var(--kindi-mint-mid)',
    mood: 'wow',
  },
  {
    id: 'quiz-champ',
    name: 'Quiz Champ',
    rule: 'Earn 275 stars',
    threshold: 275,
    color: 'var(--kindi-coral)',
    mood: 'wink',
  },
  {
    id: 'starry-night',
    name: 'Starry Night',
    rule: 'Earn 500 stars',
    threshold: 500,
    color: 'var(--kindi-butter-mid)',
    mood: 'sleepy',
  },
];

export function stickersUnlockedFor(stars: number): string[] {
  return STICKERS.filter((s) => stars >= s.threshold).map((s) => s.id);
}

export function newlyUnlocked(prevStars: number, nextStars: number): Sticker[] {
  return STICKERS.filter((s) => prevStars < s.threshold && nextStars >= s.threshold);
}

export function nextSticker(stars: number): Sticker | null {
  return STICKERS.find((s) => stars < s.threshold) ?? null;
}

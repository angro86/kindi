import { ChildProfile } from '@/types';

const PREFIX = 'kindi:';

const KEYS = {
  kids: `${PREFIX}kids`,
  activeKidId: `${PREFIX}active-kid-id`,
  parentPin: `${PREFIX}parent-pin`,
  stars: (kidId: number) => `${PREFIX}stars:${kidId}`,
  stickers: (kidId: number) => `${PREFIX}stickers:${kidId}`,
  history: (kidId: number) => `${PREFIX}history:${kidId}`,
} as const;

export interface WatchEvent {
  videoId: number;
  youtubeId: string;
  title: string;
  channel: string;
  watchedAt: number;
}

const HISTORY_LIMIT = 20;

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full, blocked, etc — silently drop
  }
}

function remove(key: string) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

const DEFAULT_KIDS: ChildProfile[] = [
  { id: 1, name: 'Nico', age: 5, avatar: 0 },
  { id: 2, name: 'Adri', age: 3, avatar: 1 },
];

export const storage = {
  getKids(): ChildProfile[] {
    return read<ChildProfile[]>(KEYS.kids, DEFAULT_KIDS);
  },
  setKids(kids: ChildProfile[]) {
    write(KEYS.kids, kids);
  },

  getActiveKidId(): number | null {
    return read<number | null>(KEYS.activeKidId, null);
  },
  setActiveKidId(id: number | null) {
    if (id === null) remove(KEYS.activeKidId);
    else write(KEYS.activeKidId, id);
  },

  getStars(kidId: number): number {
    return read<number>(KEYS.stars(kidId), 0);
  },
  addStars(kidId: number, delta: number): number {
    const next = Math.max(0, this.getStars(kidId) + delta);
    write(KEYS.stars(kidId), next);
    return next;
  },

  getStickers(kidId: number): string[] {
    return read<string[]>(KEYS.stickers(kidId), []);
  },
  unlockSticker(kidId: number, stickerId: string) {
    const current = this.getStickers(kidId);
    if (current.includes(stickerId)) return current;
    const next = [...current, stickerId];
    write(KEYS.stickers(kidId), next);
    return next;
  },

  getHistory(kidId: number): WatchEvent[] {
    return read<WatchEvent[]>(KEYS.history(kidId), []);
  },
  recordWatch(kidId: number, event: WatchEvent) {
    const filtered = this.getHistory(kidId).filter((e) => e.videoId !== event.videoId);
    const next = [event, ...filtered].slice(0, HISTORY_LIMIT);
    write(KEYS.history(kidId), next);
    return next;
  },

  getParentPin(): string | null {
    return read<string | null>(KEYS.parentPin, null);
  },
  setParentPin(pin: string | null) {
    if (pin === null) remove(KEYS.parentPin);
    else write(KEYS.parentPin, pin);
  },
};

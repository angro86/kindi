import { Video } from '@/types';

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function getFilteredVideos(
  videos: Video[],
  ageGroup: number,
  activeCategories: string[],
  search: string
): Video[] {
  // Filter videos first
  const matchingVideos = videos.filter((v) => {
    if (ageGroup < v.ageMin || ageGroup > v.ageMax) return false;
    if (!activeCategories.includes(v.cat)) return false;
    if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (matchingVideos.length === 0) return [];

  // Group by channel
  const byChannel: Record<string, Video[]> = {};
  matchingVideos.forEach((v) => {
    if (!byChannel[v.channel]) byChannel[v.channel] = [];
    byChannel[v.channel].push(v);
  });

  // Seeded shuffle each channel (consistent per session)
  const seed = ageGroup * 1000 + activeCategories.join('').length;
  const seededRandom = (i: number) => {
    const x = Math.sin(seed + i) * 10000;
    return x - Math.floor(x);
  };

  let idx = 0;
  Object.keys(byChannel).forEach((ch) => {
    byChannel[ch].sort(() => seededRandom(idx++) - 0.5);
  });

  // Round-robin interleave from each channel
  const result: Video[] = [];
  const channels = Object.keys(byChannel).sort(() => seededRandom(idx++) - 0.5);
  let added = true;
  while (added) {
    added = false;
    for (const ch of channels) {
      if (byChannel[ch].length > 0) {
        result.push(byChannel[ch].shift()!);
        added = true;
      }
    }
  }
  return result;
}

import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

import { VIDEOS } from '../src/data/videos';
import type { QuizQuestion, TimedQuestion } from '../src/types';

const client = new Anthropic();
const YT_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YT_API_KEY) {
  console.error('Missing YOUTUBE_API_KEY environment variable');
  process.exit(1);
}

interface VideoMetadata {
  title: string;
  description: string;
  tags: string[];
  durationSec: number;
}

function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return (parseInt(match[1] || '0') * 3600) +
         (parseInt(match[2] || '0') * 60) +
         (parseInt(match[3] || '0'));
}

async function fetchMetadataBatch(videoIds: string[]): Promise<Record<string, VideoMetadata>> {
  const result: Record<string, VideoMetadata> = {};
  // API allows up to 50 IDs per request
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const ids = batch.join(',');
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${ids}&part=snippet,contentDetails&key=${YT_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.error('YouTube API error:', data.error.message);
      continue;
    }

    for (const item of (data.items || [])) {
      result[item.id] = {
        title: item.snippet.title || '',
        description: (item.snippet.description || '').substring(0, 500),
        tags: (item.snippet.tags || []).slice(0, 15),
        durationSec: parseDuration(item.contentDetails.duration),
      };
    }
  }
  return result;
}

async function generateQuestions(
  meta: VideoMetadata,
  age: number,
  numQuestions: number
): Promise<QuizQuestion[]> {
  const prompt = `You are generating quiz questions for a child aged ${age}. Based on this children's video, create ${numQuestions} simple, age-appropriate question(s) about what the video teaches.

Video title: "${meta.title}"
Video description: "${meta.description}"
Video tags: ${meta.tags.join(', ')}

Respond with ONLY a valid JSON array, no markdown:
[{"q": "question text", "answers": ["option1", "option2", "option3"], "correct": 0, "emoji": "🔤"}]

Rules:
- "correct" must be the 0-based index of the correct answer (0, 1, or 2)
- Questions should be about the educational topic of the video
- Use simple language appropriate for age ${age}
- Pick a relevant emoji for each question's topic
- Keep answers short (1-4 words each)
- Each question should cover a different aspect of the video's topic
- Make questions specific to what this video teaches, not generic`;

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-20250414',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const parsed = JSON.parse(text);
    return (Array.isArray(parsed) ? parsed : [parsed]).map((q: { q: string; answers: [string, string, string]; correct: 0 | 1 | 2; emoji: string }) => ({
      q: q.q,
      answers: q.answers,
      correct: q.correct,
      emoji: q.emoji,
    } satisfies QuizQuestion));
  } catch (e) {
    console.error('  Failed to generate question:', (e as Error).message);
    return [];
  }
}

async function main() {
  const result: Record<string, TimedQuestion[]> = {};
  let generated = 0;
  let skipped = 0;

  console.log(`Fetching metadata for ${VIDEOS.length} videos...\n`);

  // Fetch all video metadata in batches
  const allIds = VIDEOS.map(v => v.youtubeId);
  const metadata = await fetchMetadataBatch(allIds);
  console.log(`Got metadata for ${Object.keys(metadata).length} videos\n`);

  for (let i = 0; i < VIDEOS.length; i++) {
    const video = VIDEOS[i];
    const meta = metadata[video.youtubeId];

    console.log(`[${i + 1}/${VIDEOS.length}] ${video.title} (${video.youtubeId})`);

    if (!meta) {
      console.log('  Skipped: no metadata');
      skipped++;
      continue;
    }

    // Generate 1 question per 180s of video, minimum 1
    const numQuestions = Math.max(1, Math.floor(meta.durationSec / 180));
    const questions = await generateQuestions(meta, video.ageMin, numQuestions);

    if (questions.length > 0) {
      const timedQuestions: TimedQuestion[] = questions.map((q, idx) => ({
        startSec: idx * 180,
        question: q,
      }));
      result[video.youtubeId] = timedQuestions;
      generated += questions.length;
      for (const q of questions) {
        console.log(`  ✓ ${q.q}`);
      }
    } else {
      skipped++;
    }

    // Write incrementally every 20 videos
    if ((i + 1) % 20 === 0) {
      writeOutput(result);
      console.log(`  [saved progress: ${generated} questions so far]`);
    }
  }

  writeOutput(result);
  console.log(`\nDone! ${generated} questions generated for ${Object.keys(result).length} videos. ${skipped} skipped.`);
}

function writeOutput(result: Record<string, TimedQuestion[]>) {
  const output = `import { VideoQuestions } from '@/types';

export const VIDEO_QUESTIONS: VideoQuestions = ${JSON.stringify(result, null, 2)};
`;
  const outPath = resolve(__dirname, '../src/data/generated-questions.ts');
  writeFileSync(outPath, output, 'utf-8');
}

main().catch(console.error);

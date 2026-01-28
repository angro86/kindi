import Anthropic from '@anthropic-ai/sdk';
import { YoutubeTranscript } from 'youtube-transcript';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

// Import video data directly — tsx handles the path alias via tsconfig
import { VIDEOS } from '../src/data/videos';
import { QUIZ_INTERVAL } from '../src/lib/constants';
import type { QuizQuestion, TimedQuestion } from '../src/types';

const client = new Anthropic();

interface TranscriptEntry {
  text: string;
  offset: number;
  duration: number;
}

function chunkTranscript(entries: TranscriptEntry[], intervalSec: number): { startSec: number; text: string }[] {
  const chunks: { startSec: number; text: string }[] = [];
  let currentChunkStart = 0;
  let currentLines: string[] = [];

  for (const entry of entries) {
    const entrySec = entry.offset / 1000;
    if (entrySec >= currentChunkStart + intervalSec && currentLines.length > 0) {
      chunks.push({ startSec: currentChunkStart, text: currentLines.join(' ') });
      currentChunkStart += intervalSec;
      currentLines = [];
    }
    currentLines.push(entry.text);
  }

  if (currentLines.length > 0) {
    chunks.push({ startSec: currentChunkStart, text: currentLines.join(' ') });
  }

  return chunks;
}

async function generateQuestion(transcript: string, age: number): Promise<QuizQuestion | null> {
  const prompt = `You are generating a quiz question for a child aged ${age}. Based ONLY on this transcript segment from a children's video, create one simple, age-appropriate question about what was discussed.

Transcript:
"""
${transcript}
"""

Respond with ONLY valid JSON, no markdown:
{"q": "question text", "answers": ["option1", "option2", "option3"], "correct": 0, "emoji": "🔤"}

Rules:
- "correct" must be the 0-based index of the correct answer (0, 1, or 2)
- The question must be directly answerable from the transcript
- Use simple language appropriate for age ${age}
- Pick a relevant emoji for the topic
- Keep answers short (1-4 words each)`;

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-20250414',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const parsed = JSON.parse(text);
    return {
      q: parsed.q,
      answers: parsed.answers,
      correct: parsed.correct,
      emoji: parsed.emoji,
    };
  } catch (e) {
    console.error('  Failed to generate question:', (e as Error).message);
    return null;
  }
}

async function main() {
  const result: Record<string, TimedQuestion[]> = {};
  let processed = 0;
  let skipped = 0;
  let generated = 0;

  console.log(`Processing ${VIDEOS.length} videos...\n`);

  for (const video of VIDEOS) {
    processed++;
    const age = video.ageMin;
    console.log(`[${processed}/${VIDEOS.length}] ${video.title} (${video.youtubeId})`);

    let entries: TranscriptEntry[];
    try {
      entries = await YoutubeTranscript.fetchTranscript(video.youtubeId);
    } catch {
      console.log('  Skipped: no transcript available');
      skipped++;
      continue;
    }

    if (entries.length === 0) {
      console.log('  Skipped: empty transcript');
      skipped++;
      continue;
    }

    const chunks = chunkTranscript(entries, QUIZ_INTERVAL);
    const questions: TimedQuestion[] = [];

    for (const chunk of chunks) {
      if (chunk.text.trim().length < 30) {
        console.log(`  Skipped chunk at ${chunk.startSec}s: too short`);
        continue;
      }

      const question = await generateQuestion(chunk.text, age);
      if (question) {
        questions.push({ startSec: chunk.startSec, question });
        generated++;
        console.log(`  ✓ Question for ${chunk.startSec}s: ${question.q}`);
      }
    }

    if (questions.length > 0) {
      result[video.youtubeId] = questions;
    }
  }

  // Write output
  const output = `import { VideoQuestions } from '@/types';

export const VIDEO_QUESTIONS: VideoQuestions = ${JSON.stringify(result, null, 2)};
`;

  const outPath = resolve(__dirname, '../src/data/generated-questions.ts');
  writeFileSync(outPath, output, 'utf-8');

  console.log(`\nDone! ${generated} questions generated, ${skipped} videos skipped.`);
  console.log(`Output: ${outPath}`);
}

main().catch(console.error);

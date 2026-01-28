import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

async function getTranscript(videoId: string, watchedSeconds: number): Promise<string> {
  const items = await YoutubeTranscript.fetchTranscript(videoId);
  const filtered = items.filter((item: { offset: number }) => item.offset / 1000 <= watchedSeconds);
  return filtered.map((item: { text: string }) => item.text).join(' ').trim();
}

export async function POST(request: NextRequest) {
  try {
    const { videoId, videoTitle, videoChannel, age, watchedSeconds } = await request.json();

    // Try to fetch transcript
    let transcript = '';
    try {
      transcript = await getTranscript(videoId, watchedSeconds);
    } catch (e) {
      console.log('Could not fetch transcript:', (e as Error).message);
    }

    const minutesWatched = Math.max(1, Math.round(watchedSeconds / 60));

    let contentContext: string;
    if (transcript && transcript.length > 20) {
      contentContext = `Video title: "${videoTitle}"
Channel: "${videoChannel}"

EXACT TRANSCRIPT (what was shown/said in the first ${minutesWatched} minute(s)):
"${transcript.substring(0, 2000)}"

IMPORTANT: Base your question ONLY on what was actually said in the transcript above.`;
    } else {
      contentContext = `Video title: "${videoTitle}"
Channel: "${videoChannel}"

No transcript available. Generate a question based on the video title and channel.`;
    }

    const prompt = `You are generating a quiz question for a child aged ${age}. Based on this children's video content, create 1 simple, age-appropriate question about what was actually shown/said.

${contentContext}

Respond with ONLY a valid JSON object, no markdown:
{"q": "question text", "answers": ["option1", "option2", "option3"], "correct": 0, "emoji": "🔤"}

Rules:
- "correct" must be the 0-based index of the correct answer (0, 1, or 2)
- Use simple language appropriate for age ${age}
- Pick a relevant emoji for the question's topic
- Keep answers short (1-4 words each)
- Make the question specific to what was actually said/shown in the video`;

    const response = await client.messages.create({
      model: 'claude-haiku-4-20250414',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const question = JSON.parse(text);

    return NextResponse.json({
      q: question.q,
      answers: question.answers,
      correct: question.correct,
      emoji: question.emoji,
    });
  } catch (e) {
    console.error('Quiz generation error:', (e as Error).message);
    return NextResponse.json({ error: 'Failed to generate question' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API error:', err);
      return NextResponse.json({ error: 'LLM request failed' }, { status: 500 });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Strip markdown fences if present
    const jsonStr = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const question = JSON.parse(jsonStr);

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

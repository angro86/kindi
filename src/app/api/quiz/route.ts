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

    console.log(`[quiz] Generating for video="${videoTitle}" (${videoId}), videoTime=${watchedSeconds}s, age=${age}`);

    // Try to fetch transcript
    let transcript = '';
    try {
      transcript = await getTranscript(videoId, watchedSeconds);
      console.log(`[quiz] Transcript fetched: ${transcript.length} chars`);
    } catch (e) {
      console.log('[quiz] Could not fetch transcript:', (e as Error).message);
    }

    const hasTranscript = transcript && transcript.length > 20;
    const minutesWatched = Math.max(1, Math.round(watchedSeconds / 60));

    let contentContext: string;
    if (hasTranscript) {
      contentContext = `Video title: "${videoTitle}"
Channel: "${videoChannel}"

EXACT TRANSCRIPT (what was shown/said in the first ${minutesWatched} minute(s)):
"${transcript.substring(0, 2000)}"

IMPORTANT: Base your question ONLY on specific facts, words, or topics mentioned in the transcript above. Do NOT ask generic or broad questions.`;
    } else {
      contentContext = `Video title: "${videoTitle}"
Channel: "${videoChannel}"

No transcript available. Generate a specific question about the topic in the video title. Ask about a concrete fact related to the title topic, not a vague or generic question.`;
    }

    const prompt = `You are generating a quiz question for a child aged ${age}. Create 1 simple, age-appropriate question.

${contentContext}

Respond with ONLY a valid JSON object, no markdown:
{"q": "question text", "answers": ["option1", "option2", "option3"], "correct": 0, "emoji": "🔤"}

Rules:
- "correct" must be the 0-based index of the correct answer (0, 1, or 2)
- Use simple language appropriate for age ${age}
- Pick a relevant emoji for the question's topic
- Keep answers short (1-4 words each)
- The question MUST be about a specific fact or detail, NOT a generic question like "What do scientists use?" or "What is this video about?"
- ${hasTranscript ? 'Ask about something EXPLICITLY mentioned in the transcript' : 'Ask about a specific fact related to the video title topic'}`;

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
      console.error('[quiz] Gemini API error:', err);
      return NextResponse.json({ error: 'LLM request failed' }, { status: 500 });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log(`[quiz] Gemini response: ${text}`);

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
    console.error('[quiz] Generation error:', (e as Error).message);
    return NextResponse.json({ error: 'Failed to generate question' }, { status: 500 });
  }
}

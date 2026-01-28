import { NextRequest, NextResponse } from 'next/server';

/**
 * Fetch transcript by scraping YouTube's video page for the captions URL,
 * then fetching the timedtext XML directly.
 */
async function getTranscript(videoId: string, watchedSeconds: number): Promise<string> {
  // Step 1: Fetch the YouTube video page to extract captions URL
  const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  if (!pageRes.ok) {
    throw new Error(`YouTube page fetch failed: ${pageRes.status}`);
  }

  const html = await pageRes.text();

  // Step 2: Extract captions data from the page
  const captionsMatch = html.match(/"captionTracks":\s*(\[.*?\])/);
  if (!captionsMatch) {
    throw new Error('No captions found for this video');
  }

  let captionTracks;
  try {
    captionTracks = JSON.parse(captionsMatch[1]);
  } catch {
    throw new Error('Failed to parse caption tracks');
  }

  // Pick English captions, or first available
  const track = captionTracks.find((t: { languageCode: string }) =>
    t.languageCode === 'en' || t.languageCode?.startsWith('en')
  ) || captionTracks[0];

  if (!track?.baseUrl) {
    throw new Error('No usable caption track found');
  }

  // Step 3: Fetch the actual captions XML
  const captionRes = await fetch(track.baseUrl);
  if (!captionRes.ok) {
    throw new Error(`Caption fetch failed: ${captionRes.status}`);
  }

  const xml = await captionRes.text();

  // Step 4: Parse XML to extract timed text
  const segments: { start: number; text: string }[] = [];
  const regex = /<text start="([\d.]+)"[^>]*>(.*?)<\/text>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const start = parseFloat(match[1]);
    // Decode HTML entities
    const text = match[2]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n/g, ' ')
      .trim();
    if (text) {
      segments.push({ start, text });
    }
  }

  // Step 5: Filter to only what was watched
  const filtered = segments.filter(s => s.start <= watchedSeconds);
  return filtered.map(s => s.text).join(' ').trim();
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
      if (transcript.length > 0) {
        console.log(`[quiz] Transcript preview: ${transcript.substring(0, 100)}...`);
      }
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

No transcript available. The video title says "${videoTitle}". Generate a specific factual question about the topic of ${videoTitle}. For example, if the title mentions ears or hearing, ask a specific fact about ears or hearing.`;
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
- The question MUST be directly about the topic in the video title: "${videoTitle}"
- NEVER ask generic science questions. Ask about the SPECIFIC topic: "${videoTitle}"
- ${hasTranscript ? 'Ask about something EXPLICITLY mentioned in the transcript' : `Ask a specific fact about: ${videoTitle}`}`;

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

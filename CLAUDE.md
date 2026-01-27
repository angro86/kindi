# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kindi is an educational video platform for children ages 2-8, built with Next.js (App Router) and TypeScript. It features curated YouTube content with interactive quizzes and a gamified star reward system.

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # ESLint
npm run start     # Start production server
```

Video link validation:
```bash
bash check-all.sh       # Check all YouTube IDs via noembed.com API
node check-videos.js    # Validate video URLs, report broken ones
```

## Architecture

**User flow**: Setup wizard (profile → categories → session config) → Watch page (video grid + YouTube player + quizzes + timer)

**Key directories**:
- `src/app/` — Next.js App Router; `page.tsx` is the single-page client component entry point
- `src/components/setup/` — 3-step setup wizard (child profile, categories, session duration/rewards)
- `src/components/watch/` — Video grid, YouTube player embed, watch session UI
- `src/components/modals/` — Quiz, Rewards, Profile, TimeUp modal dialogs
- `src/components/avatars/` — Animal avatar SVG components (Fox, Bunny, Owl, Panda)
- `src/data/` — Static content: `videos.ts` (249 curated videos), `categories.ts`, `questions.ts`
- `src/lib/constants.ts` — `QUIZ_INTERVAL` (180s), avatar names, duration/goal options
- `src/lib/utils.ts` — Video filtering and seeded shuffle logic
- `src/types/index.ts` — All TypeScript interfaces (Video, ChildProfile, SessionConfig, QuizQuestion)

**State management**: React hooks only (no external state library). All session state lives in `page.tsx` and flows down via props.

**Content structure**: Videos are tagged by exact age (2-8) and category. Quiz questions exist for age groups 2, 4, and 6. Categories are mapped per age in `categories.ts`.

## Key Implementation Details

- Videos are deterministically shuffled per session using a seeded random based on age and category selection (`src/lib/utils.ts`)
- Quiz modal triggers every `QUIZ_INTERVAL` seconds of video watch time
- YouTube player uses iframe embed; `next.config.ts` allows `img.youtube.com` for thumbnails
- Text-to-speech for quiz questions uses Web Speech API (`src/hooks/useSpeech.ts`)
- Path alias: `@/*` maps to `src/*`

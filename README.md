# Kindi - Educational Videos for Kids

An educational video platform for kids ages 2-8 with curated YouTube content, interactive quizzes, and a gamified reward system.

## Features

- **249 Curated Videos** - Age-appropriate educational content from trusted channels
- **Age-Based Filtering** - Content automatically filtered by child's age (2-8 years)
- **12 Categories** - Songs, Math, Reading, Science, Nature, Coding, History, and more
- **Interactive Quizzes** - Questions every 3 minutes with text-to-speech support
- **Star Rewards** - Gamified learning with customizable goals
- **Child Profiles** - Multiple profiles with cute animal avatars (Fox, Bunny, Owl, Panda)
- **Session Timer** - Configurable watch time (15, 30, 45, or 60 minutes)

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **React 19** - Latest React features

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deploy on Vercel

The easiest way to deploy is via [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository on Vercel
3. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/kindi)

## Project Structure

```
src/
├── app/                  # Next.js app router pages
├── components/
│   ├── avatars/         # Animal avatar components
│   ├── modals/          # Quiz, reward, and profile modals
│   ├── setup/           # Setup wizard components
│   ├── ui/icons/        # SVG icon components
│   └── watch/           # Video player and grid components
├── data/                # Videos, categories, and quiz questions
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and constants
└── types/               # TypeScript type definitions
```

## Legacy

The original single-file HTML version is preserved in the `legacy/` folder.

# Handoff: Kindi full redesign

## Overview
A full visual + UX redesign of Kindi — the kid-safe video player you originally built in Claude. Covers the whole experience: marketing landing, auth, parent dashboard, profile picker, kid onboarding, kid home, video player (wraps a YouTube iframe), browse/search, every-3-min quiz overlay, results screen, sticker shelf.

## About the design files
The files in this bundle are **design references built as static HTML/JSX prototypes**. They are not meant to be copy-pasted into your app. They show the **intended look, layout, and behavior**. Your job is to recreate them in your existing Kindi codebase using its established patterns (React components, your routing, your data layer, your YouTube IFrame Player API integration, etc.).

## Fidelity
**High-fidelity.** Final colors, typography, spacing, shadows, copy, and component states are all here. Recreate pixel-faithfully using your existing component primitives and design tokens — but you do **not** need to keep the inline-styled prototype structure.

## How to bring this into Claude Code

1. **Download this handoff folder** (zip), unzip it inside your Kindi repo (e.g. as `docs/design/`).
2. **Open the project in Claude Code.**
3. **Prompt Claude Code:**

   > Read `docs/design/README.md` and `docs/design/source/`. We're redesigning Kindi to match these prototypes. Start with the design system — extract tokens (colors, type, shadows, radii) from `source/styles.css` into our existing token file. Then redesign one screen at a time, beginning with **the kid home** (`source/screens/KidHome.jsx`). Map our existing data + routes onto the new layout. Don't copy the HTML verbatim — port it into our existing component conventions. Show me a plan first, then implement.

4. **Iterate screen by screen.** Each `screens/*.jsx` file is a self-contained reference for one view. Hand them to Claude Code one at a time so reviews stay manageable.

## What's in `source/`
| File | What it shows |
|---|---|
| `styles.css` | Design tokens — colors, type scale, shadows, radii, surface classes, thumbnail gradients, squiggle underline, grain texture |
| `screens/components.jsx` | Atom kit — `KindiBlob` mascot, `KindiLogo`, `Button` (5 variants), `Pill`, `Chip`, `VideoThumb`, `Avatar`, `Stars`, `StatCard`, full `Icon` set |
| `screens/Landing.jsx` | Marketing landing page |
| `screens/Auth.jsx` | Sign up (2-step) + sign in |
| `screens/ProfilePicker.jsx` | "Who is watching?" entry screen |
| `screens/KidOnboarding.jsx` | Kid first-run interest picker |
| `screens/KidHome.jsx` | Kid mode home — hero, shelves, continue watching |
| `screens/KidPlayer.jsx` | Player with **Kindi chrome above + below the YouTube iframe** (never overlays YT controls) |
| `screens/Browse.jsx` | Category browser + search field |
| `screens/Quiz.jsx` | Mid-video quiz overlay (every 3 min) + results screen with star reward |
| `screens/Achievements.jsx` | Sticker shelf — 8 stickers, locked/unlocked states |
| `screens/ParentDashboard.jsx` | Overview, approve queue, library, limits, kids tabs |
| `index.html` | Wraps everything in a pannable design canvas with mobile + desktop frames |

## Design tokens

### Color palette (oklch)
```
--kindi-blush:      oklch(0.91 0.045 28)    soft pink
--kindi-mint:       oklch(0.92 0.04 165)    soft green
--kindi-butter:     oklch(0.94 0.06 95)     soft yellow
--kindi-sky:        oklch(0.91 0.045 235)   soft blue
--kindi-lilac:      oklch(0.89 0.05 305)    soft purple
--kindi-coral:      oklch(0.78 0.14 35)     warm orange (mascot/accent)
--kindi-coral-deep: oklch(0.62 0.18 32)     primary action

Neutrals — warm cream paper-like:
--kindi-cream:    oklch(0.985 0.008 85)
--kindi-paper:    #ffffff
--kindi-ink:      oklch(0.22 0.02 50)
--kindi-ink-soft: oklch(0.45 0.025 50)
--kindi-line:     oklch(0.90 0.012 70)
```
Each pastel has `-mid` and `-deep` tints — see `styles.css`.

### Typography
- **Display:** `Fraunces` (variable serif), opsz, weight 500–700. Used for headlines, prices, big numbers.
- **Body:** `Nunito`, weights 500/600/700/800/900. Default UI font.
- **Mono:** `JetBrains Mono`, weights 500/600/700. Used for durations, time, numeric badges.

Type scale classes in `styles.css`: `t-display-xl/lg`, `t-display`, `t-h1/h2/h3`, `t-body-lg/body/sm`, `t-caption`, `t-label`, `t-mono`.

### Shadows (layered, warm)
```
--shadow-xs / sm / md / lg / xl
```
Use `xs` for chips, `sm` for cards, `md` for hover, `lg` for hero/modal, `xl` for full-screen overlay.

### Radii
`6 / 10 / 14 / 20 / 28` (xs → xl)

### Signature flourishes
- **Squiggle underline** — `.squig` wraps short emphasis words. Inline display, background-image SVG, wraps with the text.
- **Grain texture** — `.grain` adds subtle SVG noise overlay; used on hero thumbnails.
- **Thumbnail gradients** — 8 composed radial+linear gradients (`thumb-grad-1` through `-8`); used as photographic-feeling backgrounds for video thumbs.
- **`KindiBlob` mascot** — geometric soft-square shape with 4 moods: `happy / wow / wink / sleepy`. Built in pure SVG, recolorable via prop.

## Critical: YouTube iframe handling
**The player must wrap, not overlay, the YouTube embed.** See `KidPlayer.jsx`:
- Top dark strip *above* the iframe — shows "Playing on YouTube · <channel>" and the next-quiz countdown.
- The iframe itself uses YouTube's stock player (we don't fight their UI).
- Bottom dark strip *below* the iframe — Kindi's own controls (rewind 10s, save, etc).

Rationale: YouTube's IFrame API doesn't allow overlay UI on top of the player without breaking ToS / fullscreen / native controls. All Kindi-specific interaction lives in the strips that sandwich the iframe.

## Critical: Quiz cadence
The quiz overlay (`Quiz.jsx`) is designed to **interrupt every 3 minutes of cumulative watch time**. Implementation suggestion:
- Run a `setInterval` while the YouTube player state is `PLAYING` (use `onStateChange` from the IFrame API).
- After 180s of accumulated PLAYING time, pause the player (`player.pauseVideo()`) and mount the `Quiz` overlay.
- On dismiss/answer, resume (`player.playVideo()`) and reset the counter.
- Award stars via your existing rewards backend.

## State surfaces to wire up

| Screen | State you need |
|---|---|
| ProfilePicker | List of kid profiles + parent PIN gate |
| KidOnboarding | Multi-step form: avatar, age (already done in your auth flow), interests |
| KidHome | Continue-watching list, parent picks, topic-filtered feed |
| KidPlayer | Active video, YouTube IFrame Player ref, watch-time accumulator, quiz scheduler |
| Browse | Category list, search query, search results, trending (server-supplied or precomputed) |
| Quiz | Current question, picked option, correct/incorrect feedback, +stars to award |
| QuizResult | Total stars, next-sticker target, +earned this session |
| Achievements | All stickers (rule + unlocked status), total stars |
| ParentDashboard | Daily watch metrics, approve queue, channel library, time limits, bedtime schedule, kid profiles |

## Recommended port order
1. **Tokens** — extract `styles.css` vars into your existing tokens.
2. **Atoms** — port `Button`, `Pill`, `Chip`, `Icon`, `KindiBlob`, `Avatar`. These show up on every screen.
3. **KidHome + KidPlayer** — your highest-traffic surfaces.
4. **Quiz + QuizResult + Achievements** — the new gamification loop.
5. **ProfilePicker + KidOnboarding + Browse** — kid-side completeness.
6. **ParentDashboard** — biggest screen, port last.
7. **Auth + Landing** — public surfaces.

## Tweaks panel (optional)
The prototype includes a live Tweaks panel for swapping accent color and display font. You don't need to ship this, but the underlying `applyTweaks()` pattern (CSS var overrides at the root) is a clean way to support theming later.

## Questions?
If anything in the prototypes feels ambiguous when you (or Claude Code) start porting, ask back in the design chat — the source HTML is the source of truth for visual fidelity, but the answers above are the source of truth for behavior.

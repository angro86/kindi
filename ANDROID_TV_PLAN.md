# Kindi Android TV Plan

## Current State

Kindi is a Next.js 16 / React 19 / TypeScript single-page app. All UI is client-side with Tailwind CSS. YouTube videos play via the IFrame Player API embedded in a WebView-style iframe. State management is pure React hooks (no Redux/Zustand). Content data (249 videos, quiz questions, categories) is statically bundled.

**What works well for TV already:**
- Large touch targets (buttons have py-3/py-4 padding)
- Responsive grid layouts (Tailwind breakpoints)
- High-contrast colors and large emoji indicators
- 16:9 aspect-ratio video container
- Modular component structure

**What needs adaptation for TV:**
- No D-pad/remote control navigation (click/tap only)
- No focus management system (essential for TV remotes)
- Font sizes not optimized for 10-foot viewing distance
- Hover states won't work without a pointer
- Web Speech API (text-to-speech for quizzes) may not be available on Android TV
- No safe area / overscan handling

---

## The YouTube Problem

This is the single biggest constraint across **all** approaches. YouTube's API Terms of Service restrict embedded player usage on connected TV platforms. The IFrame Player API was designed for web pages and mobile apps, not Android TV. In practice:

- YouTube iframes inside an Android TV WebView often show "Video unavailable"
- The local WebView URL is not a valid referrer for YouTube's embed policies
- The deprecated Android Player API was removed in 2023

**The practical solution**: Deep-link to the YouTube TV app (pre-installed on virtually all Android TV devices) to play videos, then return to Kindi for quizzes and navigation. This changes the UX flow but is the only reliable, ToS-compliant path.

---

## Option 1: Custom WebView App (Recommended Starting Point)

**Concept**: Build a thin native Android TV shell (~100-200 lines of Kotlin) that hosts a WebView loading the existing Next.js app, with a hybrid approach for YouTube playback.

### Architecture

```
┌──────────────────────────────────────────┐
│          Android TV App (Kotlin)         │
│  ┌────────────────────────────────────┐  │
│  │         WebView (Full Screen)      │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │   Next.js App (existing)     │  │  │
│  │  │   + D-pad navigation hook    │  │  │
│  │  │   + TV-specific CSS          │  │  │
│  │  │   + Focus management         │  │  │
│  │  └──────────────────────────────┘  │  │
│  └────────────────────────────────────┘  │
│                                          │
│  YouTube Intent Bridge:                  │
│  JS calls native → launch YouTube app    │
│  YouTube app → back button → return      │
└──────────────────────────────────────────┘
```

### What You'd Build

**Native Android side (Kotlin, small):**
- `MainActivity.kt` — Full-screen WebView with Leanback launcher intent
- `AndroidManifest.xml` — TV declarations (leanback, banner icon, no touchscreen required)
- JavaScript interface bridge for launching YouTube app via Android Intent
- Handle return from YouTube app (onResume → notify WebView)

**Web side (additions to existing Next.js codebase):**
- `useDpadNavigation` hook — listen for arrow key events, manage focus index across interactive elements
- `tv.css` or Tailwind TV variant — larger fonts, visible focus rings, overscan-safe margins
- TV-aware YouTube player component — instead of embedding iframe, calls the native bridge to launch YouTube TV app
- Quiz flow adaptation — quiz triggers on return from YouTube app rather than mid-video

### Code Sharing: ~80-90%

All existing components, data, logic, and styling carry over. You add a D-pad navigation layer and TV-specific CSS on top.

### Pros
- Highest code reuse with existing codebase
- Single codebase for web + TV (with conditional styling)
- Fastest path to a working prototype
- Full control over the native shell

### Cons
- YouTube playback leaves the app (launches YouTube TV app)
- WebView performance varies on budget TV hardware
- Must implement focus management entirely in JavaScript
- Web Speech API (quiz TTS) may not work — need fallback
- Google Play Store may scrutinize WebView-only apps for TV approval

### Play Store Considerations
- Must declare `android.software.leanback` feature
- Must provide 320x180 banner icon
- Must declare `touchscreen` not required
- 64-bit required by August 2026
- Families Policy compliance needed (children's app)

---

## Option 2: React Native TV (Best Cross-Platform Investment)

**Concept**: Rebuild the UI using React Native components via the `react-native-tvos` fork + Expo, which has built-in Android TV and Apple TV support.

### Architecture

```
┌──────────────────────────────────────────┐
│        React Native TV App (Expo)        │
│                                          │
│  Shared with Next.js:                    │
│  ├── src/data/* (videos, categories,     │
│  │              questions)               │
│  ├── src/types/* (TypeScript interfaces) │
│  ├── src/lib/constants.ts                │
│  └── src/lib/utils.ts (shuffle logic)    │
│                                          │
│  New TV-specific UI:                     │
│  ├── SetupScreen (profile/categories)    │
│  ├── WatchScreen (video grid + focus)    │
│  ├── QuizModal (with RN focus system)    │
│  └── YouTube launch via Linking API      │
│                                          │
│  Built-in: D-pad focus, Leanback,        │
│            TV remote handling             │
└──────────────────────────────────────────┘
```

### What You'd Build

- Complete UI rewrite using React Native components (`View`, `Text`, `Pressable`, `FlatList`)
- Expo configuration with `@react-native-tvos/config-tv` plugin
- D-pad navigation using React Native's built-in `TVFocusGuideView` and `Pressable` focus events
- YouTube playback via `Linking.openURL()` to launch the YouTube TV app
- Text-to-speech via `expo-speech` (cross-platform, works on Android TV)
- Shared data layer: import the same `videos.ts`, `categories.ts`, `questions.ts`, `utils.ts`

### Code Sharing: ~20-30%

All data files, TypeScript types, constants, and business logic (shuffle algorithm, quiz interval timing) can be shared directly. All UI components must be rewritten.

### Pros
- Built-in D-pad focus management (no custom JavaScript hacking)
- Cross-platform: Android TV, Fire TV, Apple TV from one codebase
- Expo simplifies build/deploy pipeline
- Active ecosystem (Callstack, Amazon backing)
- `expo-speech` provides reliable TTS on TV
- React/TypeScript skills transfer directly
- Best native performance after pure Kotlin

### Cons
- Complete UI rewrite required (~70-80% of the app is UI)
- Two separate UI codebases to maintain (Next.js + React Native)
- YouTube integration still requires launching external app
- Learning curve for react-native-tvos APIs
- Higher initial development effort than WebView approach

### Play Store Considerations
- Expo config plugin handles all Leanback/TV manifest requirements automatically
- Well-established path to Play Store approval
- Amazon Fire TV also supported with same build

---

## Option 3: Native Android TV (Kotlin + Compose for TV)

**Concept**: Build a fully native Android TV app using Kotlin and Google's Compose for TV library (the official replacement for the deprecated Leanback library).

### Architecture

```
┌──────────────────────────────────────────┐
│     Native Android TV App (Kotlin)       │
│                                          │
│  Compose for TV UI:                      │
│  ├── SetupScreen (Compose components)    │
│  ├── WatchScreen (TV Material cards)     │
│  ├── VideoGrid (TvLazyRow/Column)        │
│  ├── QuizDialog (Compose dialogs)        │
│  └── RewardAnimation (Compose anim)      │
│                                          │
│  Data (converted from TypeScript):       │
│  ├── Video data classes                  │
│  ├── Category mappings                   │
│  ├── Quiz questions                      │
│  └── Seeded shuffle algorithm            │
│                                          │
│  YouTube: Intent launch to YouTube app   │
│  TTS: Android TextToSpeech API (native)  │
│  Focus: Native D-pad (automatic)         │
└──────────────────────────────────────────┘
```

### What You'd Build

- Complete app in Kotlin using Compose for TV (TV Material 1.0)
- Convert all TypeScript data to Kotlin data classes or load from shared JSON
- Reimplement the seeded shuffle algorithm, quiz timing, star reward system in Kotlin
- Use native `TextToSpeech` API (reliable, high-quality voices on Android)
- YouTube playback via Intent to YouTube app
- Native focus management (automatic with Compose for TV)
- TV Material components: `ImmersiveList`, `TvLazyRow`, `WideButton`, focus-scaling cards

### Code Sharing: ~5-10%

Data content (video IDs, quiz questions) can be exported to JSON and consumed by both apps. All logic and UI must be rewritten in Kotlin.

### Pros
- Best user experience (truly native TV feel)
- Best D-pad/focus support (automatic, no hacking)
- Best Play Store approval odds
- Best performance on all TV hardware including budget devices
- Native TextToSpeech API (reliable, high-quality)
- Google's officially recommended and supported approach
- Full access to Android TV system features (voice search, content providers, media session)

### Cons
- Near-zero code sharing with existing Next.js app
- Requires Kotlin/Compose expertise (different skill set)
- Complete rewrite of entire application
- Two completely independent codebases to maintain
- Longest initial development timeline
- Data changes must be synchronized between codebases

---

## Comparison Matrix

| Criterion | WebView (Option 1) | React Native TV (Option 2) | Native Compose (Option 3) |
|---|---|---|---|
| **Code Sharing** | 80-90% | 20-30% | 5-10% |
| **D-pad Navigation** | Manual (JS) | Built-in | Native (automatic) |
| **YouTube** | Launch YT app | Launch YT app | Launch YT app |
| **Text-to-Speech** | May not work | expo-speech (works) | Native API (best) |
| **Play Store Approval** | Uncertain | Good | Best |
| **Performance** | Variable | Good | Best |
| **Maintenance Burden** | Low (shared code) | Medium (2 UI layers) | High (2 codebases) |
| **Multi-TV Platform** | Android TV only | Android TV + Apple TV + Fire TV | Android TV only |
| **Skill Requirements** | JS/CSS + basic Kotlin | React Native + Expo | Kotlin + Compose |
| **Initial Effort** | Lowest | Medium | Highest |
| **UX Quality on TV** | Acceptable | Good | Best |

---

## Recommended Strategy

### Phase 1: Validate with WebView (Option 1)

Start with the Custom WebView approach to get a working Android TV app quickly with minimal changes to the existing codebase. This lets you:
- Test the actual user experience on a TV
- Validate that the YouTube-app-launch flow works for your use case
- Learn what TV-specific UX adaptations your app actually needs
- Ship a sideloadable APK for personal/family use fast

**Deliverables:**
1. Android project with WebView shell + Leanback manifest
2. `useDpadNavigation` hook for arrow key focus management
3. TV-specific CSS (larger fonts, focus rings, overscan margins)
4. JavaScript bridge to launch YouTube TV app for video playback
5. Quiz flow adapted for "return from YouTube" pattern

### Phase 2: Evaluate and Decide

After using the WebView version on an actual TV, you'll have concrete data on:
- Whether WebView performance is acceptable on your target hardware
- Whether the YouTube-app-launch UX is acceptable for kids
- What focus/navigation patterns work and what doesn't
- Whether Play Store submission is feasible

Based on that experience, decide:
- **If WebView is good enough** → Polish it, submit to Play Store
- **If you want better UX + multi-platform** → Migrate to React Native TV (Option 2), carrying over lessons learned
- **If you want the best possible TV experience** → Build native with Compose for TV (Option 3)

### Phase 3: Production TV App

Whichever option you choose for production, the key adaptations remain the same:
1. D-pad focus management across all interactive elements
2. 10-foot UI design (larger text, higher contrast, simpler layouts)
3. YouTube video launch via external app with return-to-Kindi flow
4. Quiz system adapted for TV interaction (D-pad selection of answers)
5. Text-to-speech solution that works on Android TV
6. Overscan-safe margins
7. Families Policy compliance for Play Store

---

## Technical Notes

### D-pad Key Mapping (for WebView approach)
```
Remote Button  →  KeyboardEvent.key
─────────────────────────────────────
Up             →  "ArrowUp"
Down           →  "ArrowDown"
Left           →  "ArrowLeft"
Right          →  "ArrowRight"
Select/OK      →  "Enter"
Back           →  "Escape" (or Android back button)
```

### YouTube TV App Launch Intent
```kotlin
// Launch YouTube TV app with specific video
val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.youtube.com/watch?v=$videoId"))
intent.setPackage("com.google.android.youtube.tv")
startActivity(intent)
```

### Play Store TV Requirements Checklist
- [ ] Declare `android.software.leanback` feature
- [ ] Declare `android.hardware.touchscreen` as NOT required
- [ ] Provide 320x180px xhdpi banner in manifest
- [ ] Declare `CATEGORY_LEANBACK_LAUNCHER` intent filter
- [ ] Support 64-bit architecture
- [ ] All UI navigable with D-pad only
- [ ] No touch-only interactions
- [ ] Comply with Families Policy (children's app)
- [ ] Content rating via IARC questionnaire

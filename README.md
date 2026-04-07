# Musician Growth Hub

Musician Growth Hub is a compact React Native + Expo app concept for practice planning, feedback, and progress tracking.

## Overview

The app combines four simple surfaces:

- a roadmap for planning practice goals
- a simulated tuner with directional feedback
- a practice dashboard for songs and recent sessions
- a lightweight analytics view for progress summaries

The project is intentionally scoped to stay easy to review while still showing state management, local persistence, derived metrics, accessibility work, and focused test coverage.

## Features

- Typed models for practice plans, songs, strings, and sessions
- Local persistence with AsyncStorage
- Derived analytics for recent activity and completion rates
- Safe-area-aware layout and dark-shell status bar handling
- Reusable UI components for metrics, tabs, and progress states
- Unit tests for analytics and storage behavior

## Technical Notes

- Practice-session metrics use a real last-7-days window rather than lifetime totals.
- Persisted session data includes a compatibility path for older saved entries that do not yet have timestamps.
- The tuner is simulated by design so the sample stays focused on product structure and app quality rather than device APIs.

## Code Tour

- [`App.tsx`](./App.tsx): app flow, screen composition, and state transitions
- [`src/components/`](./src/components): reusable UI building blocks
- [`src/utils/analytics.ts`](./src/utils/analytics.ts): derived metrics and coach messaging
- [`src/utils/storage.ts`](./src/utils/storage.ts): AsyncStorage persistence and migration handling
- [`src/utils/analytics.test.ts`](./src/utils/analytics.test.ts): analytics tests
- [`src/utils/storage.test.ts`](./src/utils/storage.test.ts): storage tests

## Screenshots

![Roadmap](./screenshots/roadmap.png)
![Tuner](./screenshots/tuner.png)
![Practice](./screenshots/practice.png)

## Run Locally

```bash
npm install
npm start
```

For web:

```bash
npm run web
```

## Validation

```bash
npm test -- --runInBand
npx tsc --noEmit
npx expo export --platform web
```

## Project Structure

```text
App.tsx
src/
  components/
  data/
  types/
  utils/
```

## Next Steps

1. Add microphone-driven pitch detection for real tuner input
2. Split the app into screen-level modules with navigation
3. Add interaction tests for key user flows
4. Replace mock content with importable seed data or a lightweight backend

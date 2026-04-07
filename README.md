# Musician Growth Hub

A polished React Native + Expo sample focused on practice planning, feedback, persistence, and derived analytics.

## Why Review This Project

This repo is intentionally small enough to review quickly and deep enough to show real engineering judgment. It is not a static UI exercise. It includes product framing, reusable components, persisted state, derived metrics, accessibility considerations, and tests around the logic most likely to regress.

The goal is simple: make it easy to evaluate how I think, how I structure code, and how I improve quality when a review surfaces real issues.

## Product Story

Musician Growth Hub is a practice companion concept for guitar players. The app combines a weekly roadmap, a simulated tuner, a practice dashboard, and lightweight analytics so a learner can plan sessions, get directional feedback, and track momentum over time.

The scope is intentionally constrained. Instead of spreading into backend work or authentication, the project focuses on the quality of the client experience and the clarity of the implementation.

## What This Demonstrates

- React Native + Expo application structure without unnecessary framework overhead
- Typed domain models for plans, songs, strings, and practice sessions
- Derived analytics instead of hard-coded dashboard values
- Local persistence with backward-compatible migration handling
- Mobile-friendly layout decisions, safe-area handling, and accessibility labels
- Utility-level unit tests for logic that would most likely regress during iteration

## What I Improved Recently

- Fixed "weekly" metrics so they now reflect a real last-7-days window rather than lifetime totals
- Added timestamp migration logic so older persisted sessions continue to load safely
- Replaced hard-coded top spacing with safe-area-aware layout handling
- Aligned status-bar styling with the app’s actual dark visual shell
- Added Jest coverage for analytics windowing and storage migration behavior

## Quick Code Tour

- [`App.tsx`](./App.tsx): screen composition, app state, and interaction flows
- [`src/components/`](./src/components): reusable UI building blocks
- [`src/utils/analytics.ts`](./src/utils/analytics.ts): derived metrics and coaching logic
- [`src/utils/storage.ts`](./src/utils/storage.ts): AsyncStorage persistence and legacy data normalization
- [`src/utils/analytics.test.ts`](./src/utils/analytics.test.ts): time-window and coach-message tests
- [`src/utils/storage.test.ts`](./src/utils/storage.test.ts): storage fallback and migration tests

## Screenshots

![Roadmap](./screenshots/roadmap.png)
![Tuner](./screenshots/tuner.png)
![Practice](./screenshots/practice.png)

## Engineering Notes

- The tuner is intentionally simulated. I chose not to add microphone input yet so the sample stays focused and easy to review.
- The analytics layer is small, but it is structured like production code: derived values live in utilities, and changes to persisted state include migration handling.
- The test coverage is deliberately targeted. I prioritized the logic most likely to create user-facing correctness bugs.

## Run Locally

```bash
npm install
npm start
```

Open the project in Expo Go for mobile, or run `npm run web` for a browser preview.

## Validation

```bash
npm test -- --runInBand
npx tsc --noEmit
npx expo export --platform web
```

## Engineering Signals

- I think about whether copy matches behavior, not just whether components render
- I treat persistence changes carefully and add migration paths when data models evolve
- I use tests to lock down business logic, especially when dates and stored state are involved
- I optimize for readable code and fast technical review, which matters in team environments

## If I Continued This

1. Add microphone-driven pitch detection for real tuner input
2. Break the app into screen-level modules with navigation
3. Add interaction tests for key user flows
4. Replace mock content with importable seed data or a lightweight backend

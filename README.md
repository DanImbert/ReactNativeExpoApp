# Musician Growth Hub

A React Native + Expo application sample built to feel closer to the kind of product thinking a company like Yousician values: practice planning, instant feedback, progress tracking, and actionable learner analytics.

## What this demo shows

- A multi-surface learner flow inside a compact Expo app
- Practice roadmap management with completion tracking
- A simulated tuner with direction-aware feedback
- Song progress and accuracy tracking
- Session logging and derived analytics that update across the app

## Why this version is stronger

The first version looked like a single-screen concept. This version is still intentionally lightweight, but it now demonstrates better engineering judgment:

- Split into reusable components and typed data models
- Derived analytics instead of mostly static display values
- More believable interactions across practice, tuning, and progress
- Clearer framing of what is real versus simulated

## Project structure

```text
App.tsx
src/
  components/
  data/
  types/
  utils/
```

## Run locally

```bash
npm start
```

## Next steps

If I were continuing this as an application project, I would prioritize:

1. Persisting learner state locally
2. Adding microphone-driven pitch detection for the tuner
3. Introducing navigation and screen-level component boundaries
4. Adding tests for analytics and key interactions

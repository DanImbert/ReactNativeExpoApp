# Musician Growth Hub

A React Native + Expo practice app concept centered on planning, feedback, and progress tracking.

## What this demo shows

- A multi-surface learner flow inside a compact Expo app
- Practice roadmap management with completion tracking
- A simulated tuner with direction-aware feedback
- Song progress and accuracy tracking
- Session logging and derived analytics that update across the app
- Local persistence so learner progress survives app restarts

## Notes

- Built with reusable components and typed data models
- Uses derived analytics instead of static summary values
- Persists learner state locally between app restarts
- The tuner is simulated and does not use microphone input

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

1. Adding microphone-driven pitch detection for the tuner
2. Introducing navigation and screen-level component boundaries
3. Adding tests for analytics and key interactions

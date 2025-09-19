## Getting Started

Install dependencies:

```
npm i
```

Run the development server:

```
npm run dev
```

Run the unit tests:

```
npm run test
```

## 🤖 AI Usage Documentation

Tools Used:

- OpenAI GPT: Used to validate that the solutions used are compatible between the current versions.
- Cursor: Used to generate the mock file, and the repetitive data focused solutions.

## 🏗️ Architecture Decisions

- Next.js for easy standardized boilerplate.
- Context API (AppStateProvider) for global state.
- AI-assisted test generation to bootstrap tests while maintaining human oversight.
- Component-first testing to ensure UI behaves correctly in isolation.

## ⚡ Challenges Faced

- Problem: AI-generated tests used Jest DOM matchers not supported in Vitest.
- Solution: Replaced toBeInTheDocument() with not.toBeNull().
- Problem: describe and it were not recognized.
- Solution: Installed proper type definitions (@types/jest) and ensured vitest globals were included.

## 🔄 What I Would Do Differently With More Time

- Refactor components to be more modular and reusable.
- Implement a performance solution for the amount of elements shown on the home page screen.
- Improve the timer feature

## 🚀 Vercel Deployment
This project is hosted at [imeal-git-main-maite-rosalies-projects.vercel.app](https://imeal-git-main-maite-rosalies-projects.vercel.app)

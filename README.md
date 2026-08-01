# DevScope

Analyze and compare GitHub profiles in seconds.

🔗 **Live demo:** [devscope-topaz.vercel.app](https://devscope-topaz.vercel.app)

## Overview

DevScope is a fast analyzer for public GitHub profiles. It provides overall stats, programming language distribution, and a side-by-side comparison mode for developers. 

I built this to demonstrate modern frontend practices: consuming a real-world REST API, handling edge cases and errors, request caching, strict typing, testing, and a custom UI/UX.

## Features

- 🔍 GitHub profile search with debounced live autocomplete
- 📊 Profile cards showing avatar, bio, repository count, and followers
- 📁 Repository list with language filters and sorting (by stars, last updated, or name)
- 🥧 Pie chart for programming language distribution
- ⚖️ Side-by-side profile comparison with bar charts (independent scales per metric)
- ⭐ Favorite profiles (persisted locally)
- ⌘K Command palette for quick search and jumping to favorites
- 🎨 Custom "git diff" themed animations (boot sequence, canvas cursor overlay, typewriter headers)

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Data Fetching | TanStack Query |
| State Management | Zustand (with persist) |
| Charts | Recharts |
| Animations | Motion (Framer Motion) |
| Testing | Vitest + React Testing Library |
| Deployment | Vercel |

## Local Development

\`\`\`bash
git clone https://github.com/Reshatel/devscope.git
cd devscope
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Running Tests

\`\`\`bash
npm run test -- --run
\`\`\`

## Project Structure

\`\`\`text
src/
├── app/            # Next.js App Router (pages, layouts, global styles)
├── components/     # React components
├── lib/            # Business logic: fetch requests, custom hooks, pure utilities
├── store/          # Zustand stores
└── types/          # TypeScript interfaces for the GitHub API
\`\`\`

Business logic is intentionally decoupled from the UI. Functions inside `lib/` are framework-agnostic and unit-tested independently of the React components that consume them.
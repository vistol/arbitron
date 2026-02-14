# CLAUDE.md

## Project Overview

ArbBot.ai is a React/TypeScript web dashboard for cryptocurrency funding rate arbitrage. It displays mock market data, lets users simulate delta-neutral trading strategies (long spot + short perpetual futures), and integrates Google Gemini AI for market risk analysis. All blockchain interactions are simulated — there is no real on-chain integration.

## Tech Stack

- **Language**: TypeScript 5.2 (strict mode)
- **Framework**: React 18.2 (functional components, hooks only)
- **Bundler**: Vite 5.1 with `@vitejs/plugin-react`
- **Styling**: Tailwind CSS via CDN (no local config/PostCSS)
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI**: `@google/genai` (Google Gemini API)
- **Module system**: ESM (`"type": "module"` in package.json)

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server
npm run build        # Type-check (tsc) then build to dist/
npm run preview      # Preview production build locally
```

There are no test, lint, or formatting commands configured.

## Project Structure

```
/
├── index.html              # HTML entry point (loads Tailwind CDN + index.tsx)
├── index.tsx               # React DOM render entry point
├── App.tsx                 # Root component — all top-level state lives here
├── types.ts                # Shared TypeScript interfaces
├── components/             # React UI components (one per file)
│   ├── AIAdvisor.tsx
│   ├── BotLogPanel.tsx
│   ├── DashboardHeader.tsx
│   ├── DepositFundsModal.tsx   # Unused, kept in source
│   ├── HelpModal.tsx
│   ├── MarketOpportunities.tsx
│   ├── OpportunityTable.tsx
│   ├── ProfitCalculator.tsx
│   ├── ProfitChart.tsx
│   ├── StatsCards.tsx
│   ├── StrategyExecutionModal.tsx
│   └── WalletConnectModal.tsx
├── services/               # Business logic and API integrations
│   ├── geminiService.ts    # Gemini AI client with graceful fallback
│   └── marketData.ts       # Mock data generation + formatting utils
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .github/workflows/
    └── jekyll-gh-pages.yml # GitHub Pages deployment (uses Jekyll builder)
```

## Architecture & Patterns

- **State management**: React hooks only (`useState`, `useEffect`, `useCallback`). All application state is centralized in `App.tsx` and passed down via props. No Redux, Context, or external state libraries.
- **Component pattern**: Functional components with `React.FC` typing. Modals use a controlled `isOpen`/`onClose` prop pattern.
- **Service layer**: `services/` contains non-UI logic. `geminiService.ts` handles Gemini API calls; `marketData.ts` generates mock data.
- **Types**: All shared interfaces (`MarketPair`, `BotLog`, `PortfolioStats`, `AIAnalysis`) are defined in `types.ts` at the project root.
- **No routing**: Single-page app with no router — the entire UI renders from `App.tsx`.

## Code Conventions

- **File naming**: PascalCase for components (`MarketOpportunities.tsx`), camelCase for services (`geminiService.ts`)
- **Component props**: Defined as inline interfaces or via `Props` suffix types
- **Styling**: Tailwind utility classes directly in JSX. No CSS modules or styled-components.
- **Imports**: Named exports for components and services. Default export only for `App.tsx`.
- **TypeScript config**: `strict: true`, target ES2020, `react-jsx` transform, `noUnusedLocals` and `noUnusedParameters` are disabled

## Environment Variables

- `API_KEY` — Google Gemini API key. Set in `.env.local` as `API_KEY=your-key`. The app degrades gracefully without it (returns a placeholder AI analysis). Exposed to client code via `process.env.API_KEY` in `vite.config.ts`.

## CI/CD

GitHub Actions workflow (`.github/workflows/jekyll-gh-pages.yml`) deploys to GitHub Pages on push to `main`. Note: the workflow currently uses the Jekyll builder rather than running `npm run build`, which is a known mismatch for this Vite/React project.

## Key Notes for AI Assistants

- There is no test suite — no test framework is installed and no test files exist.
- There is no linter or formatter configured (no ESLint, no Prettier).
- The `build` script (`tsc && vite build`) is the primary way to verify type correctness.
- All market data and wallet interactions are simulated/mocked — do not add real blockchain calls without explicit direction.
- Tailwind is loaded from CDN in `index.html`, not installed locally — there is no `tailwind.config.js`.
- The Vite config sets `base: './'` for GitHub Pages subdirectory compatibility.

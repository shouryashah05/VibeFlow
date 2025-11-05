# VibeFlow — AI-Powered Visualization & Reasoning

VibeFlow is a dark, futuristic workspace that helps engineers visualise, understand, and debate complex codebases. Upload a source folder to generate structural graphs, interactive charts, and conversational insights powered by DeepSeek (bring your own API key).

## Stack

- React 18 + Vite 5
- Tailwind CSS for theming
- Framer Motion for animated landing experiences
- Cytoscape.js for dependency graphs
- Chart.js + react-chartjs-2 for dashboards
- DeepSeek chat integration (API key required)

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` by default.

### Environment Variables

Create a `.env.local` file (ignored by git) and add your DeepSeek key if you want live responses:

```bash
VITE_DEEPSEEK_API_KEY=your_deepseek_key_here
```

Without a key, the AI Reasoning tab gracefully falls back to local summaries.

## Key Features

- **Landing Page** — cinematic hero, smooth transitions, and feature highlights.
- **Workspace** — left-hand mode selector, neon-accented header, folder uploader, and tab-aware mode dropdown.
- **Visualize Tab** — Cytoscape-based project graph plus bar, doughnut, and line charts derived from uploaded files.
- **AI Reasoning Tab** — DeepSeek-backed chat UI with graceful fallbacks if the network/API key fails.
- **Jury Mode** — teaser card outlining upcoming AI evaluation flows.

## Folder Upload Notes

- Use the folder picker in the workspace header (webkitdirectory input). VibeFlow currently processes files up to 1 MB each for responsive in-browser parsing.
- Only client-side parsing happens; nothing is uploaded to a server.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint across the project

## Roadmap

- Enhance AI Reasoning with richer summaries and tool selection.
- Deliver Jury Mode with multi-agent scoring and feedback reports.
- Persist uploaded project metadata locally for quick reloads.

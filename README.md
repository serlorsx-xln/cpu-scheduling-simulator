# CPU Scheduling Simulator

A web application that simulates and compares CPU scheduling algorithms — FCFS, SJF (non-preemptive), and Round Robin — on the same process set, side by side.

## Why it exists

It was built as a teaching/study tool for operating-systems coursework: instead of comparing scheduling algorithms on a whiteboard, you enter a process set once and get Gantt charts, per-process metrics (ST/CT/TAT/WT), average waiting times, a step-by-step "how it was computed" trace, and an animated playback of the ready queue — for every algorithm at the same time. All scheduling logic lives in pure TypeScript functions (`lib/scheduling/`) that are unit-tested against hand-calculated reference values, so the numbers shown match a by-hand calculation.

```
Process set (P1..Pn, AT = 0, BT 1..10, n ≤ 10)
        │
        ▼
┌─────────────────┐   FCFS  ──► Gantt + ST/CT/TAT/WT table + AVG WT/TAT
│ runSimulation() │   SJF   ──►  "   "     "   "     "   "     "
│ (lib/scheduling)│   RR(q) ──►  "   "     "   "     "   "  + quantum sweep
└─────────────────┘
        │
        ▼
  Comparison panel: AVG waiting time across all selected algorithms
```

## Features

- **Three algorithms on one input**: FCFS, non-preemptive SJF, and Round Robin with a configurable time quantum (default 2); select any combination, results always render in FCFS / SJF / RR order.
- **Per-algorithm result cards**: Gantt chart with time labels on every edge, a per-process row showing CPU vs. waiting intervals, and a table of Process / BT / ST / CT / TAT / WT plus the AVG WT formula.
- **Comparison summary** of average waiting time (and per-process WT) across all selected algorithms.
- **Step-by-step trace** ("hand-calculation mode") per algorithm: the queue before each decision, why a process was picked, remaining burst, and the result.
- **Animated playback**: step time forward (or auto-play at adjustable speed) across all algorithms simultaneously, showing who holds the CPU, the ready-queue order, and processes pushed to the back of the RR queue.
- **Quantum sweep chart**: AVG WT of Round Robin for every quantum value; click a point to recompute with that quantum.
- **Hover/keyboard sync**: hovering or arrow-keying the Gantt shows who runs and who waits at each time unit across all algorithms at once; hovering/clicking a process highlights it everywhere.
- **Input helpers**: 1–10 processes (quick buttons for 3/5/10), random or manual burst times, a SET-A button that loads the hand-calculated reference set (P1=5, P2=3, P3=8, q=2), presentation mode for projectors, and print-to-PDF for reports.
- **Form validation** with explicit error rules (E1–E7): process count, per-row burst times, time quantum, and algorithm selection.
- All simulation runs client-side; there is no backend beyond a health endpoint.

## Requirements

- Node.js (the Docker image uses Node 24; any recent LTS should work)
- npm

## Usage

```bash
npm install
npm run dev        # development server on http://localhost:3000
```

Other scripts:

| Command | What it does |
|---|---|
| `npm run build` | Production build (standalone output) |
| `npm start` | Serve the production build |
| `npm run test` | Run the 60 Vitest unit tests |
| `npm run lint` | ESLint |

### Tests

`npm run test` covers the algorithm implementations (`lib/scheduling/`), form validation (`lib/validation.ts`), and the timeline/trace helpers. Tests check structural invariants (TAT = CT since AT = 0, WT = TAT − BT, Gantt contiguity, Σ Gantt span = Σ BT), compare against the hand-calculated SET-A reference, and cross-check the step trace against the real Gantt output over 300 randomized cases. The Docker build runs the tests too — a failing test fails the build.

### API

| Route | Method | Description |
|---|---|---|
| `/api/health` | GET | Returns `{"status":"ok"}` with `Cache-Control: no-store`; used by the Docker `HEALTHCHECK` |

## Deploy

The app ships as a multi-stage Docker image built for Coolify (a `coolify.yaml` manifest is included):

```bash
docker build -t cpu-scheduling-simulator .
docker run --rm -p 3000:3000 cpu-scheduling-simulator
curl http://localhost:3000/api/health   # {"status":"ok"}
```

The Dockerfile (based on `node:24-alpine`):

1. **deps** — `npm ci --include=dev` (dev dependencies are needed for tests/build even when `NODE_ENV=production` is injected at build time)
2. **builder** — runs `npm run test` (deploy fails if tests fail), then `npm run build`
3. **runner** — copies only the Next.js standalone server, static assets, and `public/`; runs as the non-root `nextjs` user on port 3000, with a `wget`-based health check against `/api/health`

Runtime environment (set in the image, no configuration required):

| Variable | Value | Notes |
|---|---|---|
| `PORT` | `3000` | Container port; map it with `-p` |
| `HOSTNAME` | `0.0.0.0` | Required for the standalone server inside a container |
| `NODE_ENV` | `production` | Set in the runner stage; do not set it as a build-time env or `npm ci` will skip dev dependencies |
| `NEXT_TELEMETRY_DISABLED` | `1` | Disables Next.js telemetry |

Detailed Coolify deployment notes are in [docs/DEPLOY.md](docs/DEPLOY.md) (in Thai).

## Security notes

- The app handles no money, authentication, or secrets, and stores nothing — all input stays in the browser.
- The standalone server runs as a non-root user in the container, and `next.config.ts` sets `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, a restrictive `Permissions-Policy`, and disables the `X-Powered-By` header.
- Fonts (LINE Seed Sans TH, Geist Mono) are self-hosted woff2 files, so the app makes no external font requests.

## Project structure

```
app/              Next.js App Router page, fonts, and /api/health route
components/       UI: form, process table, Gantt/timeline, playback, traces, charts
components/ui/    shadcn/ui primitives
lib/scheduling/   Algorithm logic as pure functions (fcfs, sjf, rr, trace, timeline)
lib/validation.ts Form validation rules (E1–E7)
tests/            Vitest unit tests
docs/             Project documentation (Thai): plan, requirements, algorithms, tests, deploy
```

## License

No license file is present in this repository; the package is marked `private`. All rights reserved by the repository owner unless stated otherwise.

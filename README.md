# CPU Scheduling Simulator

A web application that simulates and compares CPU scheduling algorithms — **FCFS**, **SJF (non-preemptive)**, and **Round Robin** — on the same process set, side by side. Built as the CSxxx Operating Systems term project.

```
Process set (P1..Pn, AT = 0, BT 1..10, n ≤ 10)
        │
        ▼
┌─────────────────┐   FCFS  ──► Gantt + ST/CT/TAT/WT table + AVG WT
│ runSimulation() │   SJF   ──►  "   "     "   "     "   "
│ (lib/scheduling)│   RR(q) ──►  "   "     "   "     "   "  + quantum sweep
└─────────────────┘
        │
        ▼
  Comparison panel: AVG waiting time across all selected algorithms
```

## How to run

**Requirements:** Node.js 20+ (the Docker image uses Node 24) and npm. No database, no environment variables — everything runs in the browser.

```bash
npm install
npm run dev        # open http://localhost:3000
```

Or open the deployed version: **http://cpuscheduling-simulator.synverge.dev**

| Command | What it does |
|---|---|
| `npm run dev` | Development server at http://localhost:3000 |
| `npm run build` | Production build (standalone output) |
| `npm start` | Serve the production build |
| `npm run test` | Run the 60 Vitest unit tests |
| `npm run lint` | ESLint |

**Tools & versions:** Next.js 16.3.7 (App Router) · React 19.2.8 · TypeScript 5 · Tailwind CSS 4 · shadcn/ui (Radix) · Vitest 5. The app ships as a multi-stage Docker image (`node:24-alpine`); deployment details are in [docs/DEPLOY.md](docs/DEPLOY.md).

## How to use

1. **Number of processes** — pick 1–10 (quick buttons for 3 / 5 / 10). The app creates rows P1, P2, …, Pn. All processes arrive at the same time (AT = 0), per the assignment.
2. **Burst times** — two modes:
   - *Random* — the system generates positive integers (1–10). "สุ่มใหม่" regenerates.
   - *Manual* — type each BT yourself.
3. **Algorithms** — tick FCFS, SJF, RR (any combination). For RR the **Time Quantum** defaults to **2** and can be changed to any positive integer before running.
4. **คำนวณ** — each selected algorithm renders its own result card: Gantt chart with time labels, a per-process row (CPU vs. waiting intervals), and the table **Process / AT / BT / ST / CT / TAT / WT** plus `AVG WT = ΣWT ÷ n`.
   - Formulas: `TAT = CT − AT`, `WT = TAT − BT`. Since every AT = 0, TAT = CT.
   - For RR, **ST is the first time the process gets the CPU** (a process may run several times; CT is when it finishes).
5. **Compare** — the comparison summary ranks the selected algorithms by average waiting time on the same input. The **Quantum sweep** chart plots RR's AVG WT for every q; click a point to recompute with that q.
6. **Watch it work** — the step-by-step trace (hand-calculation mode) shows the ready queue before each decision, why a process was picked, and the remaining burst; the playback bar animates the whole run.

Invalid input is rejected with explicit messages (E1–E7): empty process count, zero/negative count, non-integer or non-positive BT, incomplete rows, invalid quantum.

## Test data & test cases (assignment 1.6)

**SET-A** — the standard hand-calculated reference set (press the "SET-A" button to load it):

> BT: P1 = 5, P2 = 3, P3 = 8, AT = 0 for all, q = 2

Full hand-calculation walkthrough: [docs/07-HAND-CALCULATION.md](docs/07-HAND-CALCULATION.md).

| Case | Steps | Expected |
|---|---|---|
| **T1** — manual BT, compare all three | SET-A, tick all 3 algorithms, run | Every cell matches §7.5 of the hand-calculation doc, including AVG WT and the Gantt shapes |
| **T2** — random BT, all processes complete | n = 10, random, run all 3 | Table complete P1–P10, no blanks/NaN; last CT = ΣBT; AVG WT = ΣWT ÷ 10 |
| **T3** — same data, change quantum | SET-A, RR only, q = 1 / 2 / 4 | AVG WT differs by q; final Gantt end = 16 in all cases; q ≥ 8 behaves like FCFS |
| **T4** — validation | submit empty / zero / non-integer BT / non-integer q / missing rows | Explicit error message for each rule (E1–E7) |

Screenshots of each case are recorded in [docs/11-MANUAL-TESTS.md](docs/11-MANUAL-TESTS.md).

## Unit tests

`npm run test` (Vitest) covers the algorithm implementations (`lib/scheduling/`), form validation (`lib/validation.ts`), and timeline/trace helpers: structural invariants (TAT = CT since AT = 0, WT = TAT − BT, Gantt contiguity, Σ Gantt span = Σ BT), the hand-calculated SET-A reference, and cross-checks of the step trace against the real Gantt output over 300 randomized cases. The Docker build runs the tests too — a failing test fails the build.

## Team & responsibilities

| Role | Scope | Member |
|---|---|---|
| **Algorithm & computation** | `lib/scheduling/` — FCFS / SJF / RR logic, ST/CT/TAT/WT/AVG-WT computation, unit tests | _(member 1 — name)_ |
| **User interface** | `components/` — input form, process table, result tables, Gantt/playback, wiring UI to computation | _(member 2 — name)_ |
| **Testing, README & video** | Test cases T1–T4, verification, this README, video planning/recording/editing (both videos) | _(member 3 — name)_ |

_(fill in real names; multiple members may share a role — list what each person actually did here)_

## Use of AI (transparency statement)

The project used **Claude (Claude Code)** as an assistant. Everything AI produced was reviewed, tested, and hand-verified before being kept; the team can explain and modify every part of the code. Where AI was used:

| Stage | How AI helped | Example prompt |
|---|---|---|
| Algorithm explanation | Explained RR context switches and why small q raises waiting time in this model | "อธิบายหลักการ Round Robin และเหตุผลที่ quantum เล็กทำให้ AVG WT สูงขึ้น พร้อมยกตัวอย่างตัวเลข" |
| Program structure | Designed the split between pure scheduling functions and React UI, and the folder layout | "ช่วยออกแบบโครงสร้างโปรเจกต์ Next.js แยกส่วนคำนวณออกจาก UI และบอกเหตุผล" |
| Code generation | Wrote the first version of `simulateRr`, the Gantt component, and the validation rules | "เขียนฟังก์ชัน simulateRr รับ burstTimes กับ quantum คืน startTime completionTime และ gantt ให้ ST เป็นเวลาที่ได้ CPU ครั้งแรก" |
| Debugging | Fixed an RR ordering bug where a re-queued process jumped ahead of newly-arrived ones | "ผล RR ไม่ตรงกับคำนวณมือตอนโปรเซสถูกเติมกลับท้ายคิว ช่วยหาสาเหตุ" |
| Test data & verification | Generated randomized cross-checks (300 cases) comparing the trace against the Gantt output | "เขียน test เทียบผล trace กับ gantt จากข้อมูลสุ่ม 300 ชุด เพื่อยืนยันว่าสอดคล้องกัน" |
| Presentation planning | Outlined the two video scripts against the assignment checklist | "ช่วยทำโครงร่างสคริปต์วิดีโออธิบายโปรแกรมให้ครอบคลุมหัวข้อที่อาจารย์กำหนด" |

**How AI output was verified:** every metric was checked against hand calculations (SET-A), invariants are enforced by unit tests, and manual browser test cases T1–T4 confirm what the tests claim. AI was never used to produce results without review.

## Project structure

```
app/              Next.js App Router page, fonts, and /api/health route
components/       UI: form, process table, Gantt/timeline, playback, traces, charts
components/ui/    shadcn/ui primitives
lib/scheduling/   Algorithm logic as pure functions (fcfs.ts, sjf.ts, rr.ts, trace, timeline)
lib/validation.ts Form validation rules (E1–E7)
tests/            Vitest unit tests (60)
docs/             Project documentation (Thai): plan, requirements, algorithms, hand calculation, tests, deploy
```

Where each assignment requirement lives in the code:

| Assignment item | Code |
|---|---|
| 1.1 process naming, AT = 0 | `lib/scheduling/types.ts`, `lib/scheduling/simulate.ts` (builds P1..Pn) |
| 1.2 BT random / manual + validation | `components/ProcessTableInput.tsx`, `lib/validation.ts` |
| 1.3 algorithm selection, quantum default 2 | `components/SchedulingForm.tsx`, `lib/scheduling/fcfs.ts`, `sjf.ts`, `rr.ts` |
| 1.4 result table + AVG WT + comparison | `lib/scheduling/simulate.ts` (metrics), `components/ResultTable.tsx`, `ComparisonSummary.tsx` |
| 1.5 input checking with messages | `lib/validation.ts` (rules E1–E7), `components/ErrorSummary.tsx` |
| 1.6 tests | `tests/scheduling.test.ts`, `docs/07-HAND-CALCULATION.md`, `docs/11-MANUAL-TESTS.md` |

## Deploy

The app ships as a multi-stage Docker image built for Coolify (a `coolify.yaml` manifest is included):

```bash
docker build -t cpu-scheduling-simulator .
docker run --rm -p 3000:3000 cpu-scheduling-simulator
curl http://localhost:3000/api/health   # {"status":"ok"}
```

The Dockerfile (based on `node:24-alpine`): **deps** → `npm ci --include=dev`; **builder** → runs `npm run test` (a failing test fails the build), then `npm run build`; **runner** → copies the Next.js standalone server and static assets, runs as the non-root `nextjs` user on port 3000 with a `wget` health check against `/api/health`.

## Security notes

- The app handles no money, authentication, or secrets, and stores nothing — all input stays in the browser.
- The standalone server runs as a non-root user in the container; `next.config.ts` sets standard hardening headers and disables `X-Powered-By`.
- Fonts are self-hosted woff2 files, so the app makes no external requests.

## License

The package is marked `private`. All rights reserved by the repository owner unless stated otherwise.

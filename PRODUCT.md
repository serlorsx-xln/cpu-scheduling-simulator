# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Instructor / grader** — watches a live demo (projector or laptop) during the term-project presentation and checks that every number matches the assignment's formulas and the hand calculation.
- **Students learning CPU scheduling** — open the simulator on their own (desktop or phone), try their own process sets, and compare how FCFS, SJF and Round Robin treat the same workload.

Desktop and mobile are equally important: both audiences must be able to run the full flow on either.

## Product Purpose

A single-page simulator that runs FCFS, SJF (non-preemptive) and Round Robin on **the same** process set and presents, per algorithm, a Process | BT | ST | CT | TAT | WT table, the average waiting time, and a Gantt chart — so the algorithms can be compared side by side. Success means a grader can verify correctness at a glance and a learner can see *why* one algorithm waits less than another.

## Positioning

Unlike a bare calculator, the simulator makes the comparison itself the product: one dataset, all selected algorithms, results aligned so differences in waiting time and execution order are visible, not just computed.

## Operating Context

- Term project for an Operating Systems course; the assignment spec lives in `docs/02-REQUIREMENTS.md` (sections 1.1–1.5) and the hand-calculated reference dataset in `docs/07-HAND-CALCULATION.md` (SET-A: P1=5, P2=3, P3=8, q=2).
- Used live during a presentation and afterwards as a self-study tool.
- UI language is Thai; scheduling terms (FCFS, SJF, Round Robin, Burst Time, Time Quantum, BT/ST/CT/TAT/WT, Gantt) stay in English.

## Capabilities and Constraints

Required by the assignment (must never change):
- Process count 1–10, auto-named P1…Pn, **Arrival Time = 0 for every process**.
- Burst Time either random (positive integers 1–10, re-roll available) or entered manually.
- Multi-select algorithms: FCFS, SJF (non-preemptive, tie → lower process number), Round Robin with Time Quantum (default 2, positive integer).
- One "calculate" action runs every selected algorithm on the same data.
- Per algorithm: table with columns Process, BT, ST (first CPU time), CT, TAT, WT; formulas TAT = CT − AT, WT = TAT − BT; AVG WT with 2 decimals.
- Validation rules E1–E7 with the exact Thai messages in `docs/02-REQUIREMENTS.md §2.5`; errors inline and summarized, never `alert()`; invalid input clears old results.

Allowed additions (confirmed): features that aid understanding or comparison — e.g. loading the SET-A reference dataset, highlighting the same process across charts, a cross-algorithm summary — as long as scheduling logic and required outputs stay exactly per spec.

Technical: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (radix-nova), Vitest; scheduling logic is pure functions in `lib/scheduling/`, validation in `lib/validation.ts`, both unit-tested (34 tests). Client-only, no backend.

## Brand Commitments

- Dark theme, premium and production-grade — explicitly **not** a terminal/console look.
- shadcn/ui for UI primitives.
- Font: **LINE Seed Sans TH** (self-hosted woff2 in `app/fonts/`, Regular + Bold only).
- No "AI slop": no pill-shaped/rounded-full decoration, no emoji as UI, no decorative gradients or glassmorphism.
- Direction (chosen 2026-09-30): the category-standard app dashboard, executed at full craft — conventions embraced, no novelty world. Quality bar: **Raycast / Arc** (character, alive, tactile detail) and **Stripe dashboard** (chart and data-table precision).

## Evidence on Hand

- Hand-calculated reference values for SET-A in `docs/07-HAND-CALCULATION.md` (AVG WT: FCFS 4.33, SJF 3.67, RR q=2 7.00).
- Full project docs in `docs/` (plan, requirements, architecture, data model, algorithms, UI, tests).
- No testimonials, users, or metrics exist; none may be invented.

## Product Principles

1. **Spec fidelity first** — every required column, formula and message is exactly as assigned; visuals never obscure a number the grader must check.
2. **Comparison is the point** — the same dataset across algorithms, laid out so differences are obvious.
3. **Explain, don't just compute** — execution order and waiting should be visible, not only tabulated.
4. **Works on the projector and on the phone** — legible at distance, usable at 375px.

## Accessibility & Inclusion

Keyboard-operable controls, labelled inputs, error text not conveyed by color alone, `role="alert"` for the error summary, reduced-motion respected.

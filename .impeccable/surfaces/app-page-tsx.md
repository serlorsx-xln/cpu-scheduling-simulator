---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: []
---

# Surface brief — Simulator (app/page.tsx)

Mode: Operate. Audience: instructor/grader watching a live demo (projector, laptop) and students self-studying on desktop or phone. Task: enter a process set, pick algorithms, calculate, verify and compare Process|BT|ST|CT|TAT|WT, AVG WT and the Gantt chart per algorithm. Constraints: assignment spec (docs/02-REQUIREMENTS.md) is law; scheduling logic untouched; Thai UI; dark; shadcn/ui; LINE Seed Sans TH; no pills, no emoji, no gradients/glass, no console look.

Memorable moment: one shared time cursor — hover or scrub any timeline and every algorithm reports who holds the CPU at that instant; pick a process and it lights up in every chart and table.

## Direction contract

THESIS: The category-standard simulator dashboard at Stripe/Raycast finish: settings rail left, results right. Refuses the loose-card pile: every algorithm shares one time scale, one table grammar, one highlight.

OWN-WORLD: Near-black neutral grounds in three steps, hairline borders, LINE Seed Sans TH for words and big figures, Geist Mono only for aligned numerals. Color is data: FCFS blue #3987e5, SJF aqua #199e70, RR orange #d95926. Gantt segments neutral; the focused process lifts to near-white everywhere. Primary action near-white; destructive red only for errors. Radii 6–10px, no pills.

STORY: The visitor sees a ready dataset, calculates (button or Ctrl/⌘+Enter), reads the AVG WT ranking first, then scrubs timelines to see why, and checks every table value against the hand calculation.

FIRST VIEWPORT: 56px app bar (mark, name, SET-A loader, shortcut hint). Left 360px sticky settings panel; right: comparison chart ranking AVG WT, then the first algorithm's Gantt with boundary times, lanes and table. Mobile: settings first, sticky bottom calculate bar.

FORM: category standard (canon), chosen by the user over the rolled Drafting Sheet; seed key 8894b509. Signature interaction: shared time crosshair + cross-chart process focus. Motion: 180ms state transitions; one reveal wipe on the Gantt after calculating; all disabled under reduced motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

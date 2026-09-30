---
name: CPU Scheduling Simulator
description: One dataset, three schedulers, one shared time scale; a dark instrument panel for comparing FCFS, SJF and Round Robin.
colors:
  page-black: "#0c0d0f"
  card-graphite: "#131417"
  surface-raised: "#1a1b1f"
  surface-secondary: "#1f2024"
  surface-accent: "#232429"
  segment-neutral: "#2c2d33"
  segment-ink: "#d6d6db"
  ink: "#ededef"
  ink-muted: "#9d9da6"
  ink-subtle: "#868690"
  error-red: "#f07070"
  hairline: "rgb(255 255 255 / 0.06)"
  border: "rgb(255 255 255 / 0.08)"
  input-stroke: "rgb(255 255 255 / 0.12)"
  focus-ring: "rgb(237 237 239 / 0.45)"
  fcfs-blue: "#3987e5"
  sjf-aqua: "#199e70"
  rr-orange: "#d95926"
typography:
  figure:
    fontFamily: "LINE Seed Sans TH, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1
  headline:
    fontFamily: "LINE Seed Sans TH, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
  title:
    fontFamily: "LINE Seed Sans TH, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.5
  section:
    fontFamily: "LINE Seed Sans TH, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.43
  body:
    fontFamily: "LINE Seed Sans TH, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "LINE Seed Sans TH, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
  numeral:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    fontFeature: "\"tnum\" 1"
  axis:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "\"tnum\" 1"
  app-title:
    fontFamily: "LINE Seed Sans TH, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
  table-dense:
    fontFamily: "LINE Seed Sans TH, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  caption:
    fontFamily: "LINE Seed Sans TH, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1
  segment-compact:
    fontFamily: "LINE Seed Sans TH, ui-sans-serif, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
rounded:
  mark-xs: "2px"
  mark-sm: "3px"
  segment: "4px"
  badge: "5px"
  md: "6px"
  lg: "8px"
  xl: "10px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.page-black}"
    typography: "{typography.section}"
    rounded: "{rounded.lg}"
    height: "40px"
    padding: "0 10px"
  button-outline:
    backgroundColor: "{colors.page-black}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "28px"
    padding: "0 10px"
  button-secondary:
    backgroundColor: "{colors.surface-secondary}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "28px"
    padding: "0 10px"
  button-ghost:
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.lg}"
    height: "36px"
    padding: "0 10px"
  card:
    backgroundColor: "{colors.card-graphite}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "20px 24px"
  input:
    textColor: "{colors.ink}"
    typography: "{typography.numeral}"
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "4px 8px"
  input-readonly:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.numeral}"
    rounded: "{rounded.lg}"
    height: "32px"
  badge-outline:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.badge}"
    height: "20px"
    padding: "2px 8px"
  gantt-segment:
    backgroundColor: "{colors.segment-neutral}"
    textColor: "{colors.segment-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.segment}"
    height: "44px"
  gantt-segment-focus:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.page-black}"
    rounded: "{rounded.segment}"
    height: "44px"
  table-header:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    height: "36px"
  error-summary:
    textColor: "{colors.error-red}"
    rounded: "{rounded.xl}"
    padding: "16px 20px"
  playback-toolbar:
    backgroundColor: "{colors.card-graphite}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "10px 16px"
  button-icon-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.page-black}"
    rounded: "{rounded.lg}"
    size: "32px"
  button-icon-ghost:
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.lg}"
    size: "32px"
  slider-track:
    backgroundColor: "{colors.surface-accent}"
    rounded: "{rounded.mark-xs}"
    height: "4px"
  slider-range:
    backgroundColor: "{colors.ink}"
    height: "4px"
  slider-thumb:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.mark-xs}"
    width: "6px"
    height: "16px"
  queue-panel:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  queue-chip:
    backgroundColor: "{colors.surface-accent}"
    textColor: "{colors.ink}"
    typography: "{typography.section}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 10px"
  queue-chip-done:
    textColor: "{colors.ink-muted}"
    typography: "{typography.section}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 10px"
  queue-chip-focus:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.page-black}"
    rounded: "{rounded.md}"
    height: "36px"
  queue-chip-cpu-fcfs:
    backgroundColor: "{colors.fcfs-blue}"
    textColor: "{colors.page-black}"
    rounded: "{rounded.md}"
    height: "36px"
  queue-chip-cpu-sjf:
    backgroundColor: "{colors.sjf-aqua}"
    textColor: "{colors.page-black}"
    rounded: "{rounded.md}"
    height: "36px"
  queue-chip-cpu-rr:
    backgroundColor: "{colors.rr-orange}"
    textColor: "{colors.page-black}"
    rounded: "{rounded.md}"
    height: "36px"
  step-row-current:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.table-dense}"
  step-row-focus:
    backgroundColor: "{colors.surface-accent}"
    textColor: "{colors.ink}"
    typography: "{typography.table-dense}"
---

# Design System: CPU Scheduling Simulator

## Overview

**Creative North Star: "The Shared Time Scale"**

A category-standard simulator dashboard finished to Stripe and Raycast standards: a settings rail on the left and results on the right, all on near-black graphite. Every algorithm is drawn on the same time scale and the same table layout, with the same highlight behaviour. That shared grammar lets a grader check numbers at a glance and lets a student see why one scheduler waits less than another. Surfaces stay quiet so that the data carries the colour, the figures and the motion.

Density is that of a working instrument, not a marketing page. Text is small and precise (12–14px), and the one large figure is the average waiting time. Grounds step up in three tones, edges are hairlines rather than shadows, and there is a single near-white primary action. The Thai interface is set in LINE Seed Sans TH. Scheduling terms (FCFS, BT, WT, Gantt) stay in English. Numerals that must line up in columns switch to Geist Mono.

Confirmed rejections: no terminal or console look, no pill shapes, no emoji used as UI, and no decorative gradients or glass.

**Key Characteristics:**
- Dark only. Three neutral ground steps with depth from hairlines.
- Colour is data. The three algorithm hues appear only on marks.
- Emphasis, not palette: processes are neutral until one is focused.
- One shared time cursor and process focus run across every chart and table; time state and process focus are drawn in separate channels.
- Two type weights (400/700). Mono is used only for aligned numerals.
- Radii of 6–10px on containers and 2–5px on data marks, with no pills.

## Colors

The palette is neutral graphite with three validated data hues. The interface has no brand accent.

### Primary
- **Near-White Ink** (ink): the primary action fill (the Calculate button, the checked checkbox, the tooltip ground) and the focus lift on a Gantt segment. Its contrast against the card is 15.8:1.

### Secondary (data series; marks only)
- **FCFS Blue** (fcfs-blue): the series colour for First-Come, First-Served.
- **SJF Aqua** (sjf-aqua): the series colour for Shortest Job First.
- **RR Orange** (rr-orange): the series colour for Round Robin.

The three hues were validated as a set (all pairs plus colour-vision-deficiency simulation) on the card-graphite surface. They fill run bars, the comparison bars, the 8–10px legend squares next to algorithm names, and the per-process WT bars. They also draw the Quantum Sweep lines and dots, and fill the CPU chip in the queue view (the one data mark that carries text; see the Filled-Chip Exception below). They never colour text, borders or backgrounds of controls.

### Neutral
- **Page Black** (page-black): the page ground, the sticky app bar and the mobile bottom bar. It is also the `theme-color`.
- **Card Graphite** (card-graphite): all cards. Contrast is measured against this surface.
- **Raised Surface** (surface-raised): the table header, read-only input wells, the stale-results notice, and hover rows. It also serves as the popover and muted ground, the queue-view panel, and the current-time row in the step table.
- **Secondary Surface** (surface-secondary): secondary buttons.
- **Accent Surface** (surface-accent): focused or pinned table rows (result table and step table), the focused per-process comparison row, the Gantt segment hover state, waiting queue chips, and the playback slider track.
- **Neutral Segment** (segment-neutral) with **Segment Ink** (segment-ink): Gantt CPU segments at rest, 9.5:1.
- **Muted Ink** (ink-muted): secondary copy, table values other than CT and WT, and labels. 6.9:1 on card.
- **Subtle Ink** (ink-subtle): axis ticks, `·` separators, algorithm short codes and footer notes. 5.1:1 on card. Do not go lower.
- **Error Red** (error-red): validation text, the error summary (a 35% border over a 6% fill) and invalid field rings. 6.4:1 on card.
- **Border / Hairline / Input stroke**: white at 8%, 6% and 12%. These strokes carry all structure.

### Named Rules
**The Color-Is-Data Rule.** Blue, aqua and orange mean FCFS, SJF and RR, and nothing else. Text always uses an ink token, even next to a series mark.

**The Filled-Chip Exception.** The CPU chip in the queue view is a data mark: it fills with the running algorithm's hue and carries Page Black text (dark-on-hue 5.01:1 on RR orange, 5.34:1 on FCFS blue, 5.71:1 on SJF aqua). It is the only component where a series hue sits behind text. Any new case must be a data mark that meets 4.5:1 dark-on-hue, never a control.

**The Red-Means-Error Rule.** Error Red appears only when input is invalid. It is never a primary, brand or delete-style accent.

**The Emphasis-Not-Palette Rule.** Processes (up to 10) never get a cycling categorical palette. In the Gantt they are neutral segments, and the focused process lifts to Near-White Ink. Its lane, table row and comparison row move to the accent surface or ink, and every non-focused lane or row dims to 45% opacity. A focused queue chip lifts to Near-White with Page Black text, the same as the Gantt segment.

### Print
Print swaps to a light token set under `@media print`: white ground and card, near-black ink (#111114, 18.9:1), muted ink #4a4a52, subtle ink #5c5c66, light grey surfaces (#f3f3f5 / #e6e6ea / accent #ececf0), black hairlines at 8–14%, and #dcdce2 segments. The three data hues stay unchanged, and colour printing is forced exact. This is the only light rendering; the screen stays dark only.

## Typography

**Body Font:** LINE Seed Sans TH (self-hosted, Regular 400 and Bold 700 only; fallback ui-sans-serif, system-ui)
**Numeral Font:** Geist Mono (400/500/600; fallback ui-monospace)

**Character:** LINE Seed carries every word and the big figures with a friendly, rounded Thai-Latin voice. Geist Mono enters only where digits must stack in columns, because LINE Seed has no tabular-figures feature.

### Hierarchy
- **Figure** (700, 1.75rem, line-height 1): the AVG WT value in each result-card header. It is the single largest number on screen. AVG TAT sits beside it at 1.125rem in muted ink.
- **Headline** (700, 1.25rem): the Results heading above the result stack.
- **Title** (700, 1rem): card titles (the algorithm full name, the comparison title). The app name in the bar is 15px bold.
- **Section** (700, 0.875rem): form section headings, chart titles, and the primary button label.
- **Body** (400, 0.875rem): descriptions, the rule line under each algorithm, and table cells (13px below `sm`). Placeholder prose is capped at 58ch.
- **Label** (400, 0.75rem): hints, legends, `dt` labels (AVG WT, AVG TAT), the cursor readout, and row labels P1…Pn. Always sentence case, never tracked uppercase.
- **Numeral / Axis** (Geist Mono with tabular-nums, 14px in tables and 11px on axes): table bodies, axis ticks (Gantt, comparison and Quantum Sweep), stepper values, formula operands, and the time flag.

Four intentional off-ramp steps sit between these roles:
- **App Title** (700, 15px): the product name in the app bar only.
- **Dense Table** (400, 13px): the step table at every width, and the result table below `sm`.
- **Caption** (400, 11px): queue-chip sub-lines ("remaining n/BT", "CT n") and Quantum Sweep line-end labels, with digits in mono.
- **Compact Segment** (700, 10px, −0.02em): Gantt segment labels when a segment is narrower than 30px. Nothing is set smaller.

Presentation mode sets the root to 18px, so the whole rem ramp scales up together; print sets it to 13px.

### Named Rules
**The Aligned-Numerals Rule.** Geist Mono is used only for digits that sit in a column or on an axis. Words, headings and standalone big figures stay in LINE Seed. In formulas, only the numbers are mono and the operators stay sans.

**The Two-Weight Rule.** LINE Seed ships 400 and 700 only. Hierarchy comes from size, weight 700 and ink step. A `font-medium` (500) request renders as Regular.

## Layout

The page is a centred 1400px container with 16px gutters (24px at `lg`). At `lg` (1024px) and wider it becomes a two-column grid: a fixed 360px settings rail that is sticky below the 56px app bar (top 5.5rem, max-height `100svh − 7rem`, and the content scrolls inside it), and a fluid results column. Columns and stacked results are separated by 24px. Below `lg`, settings stack above the results, the page auto-scrolls to the results after calculating, and a fixed bottom bar with a full-width 44px Calculate button slides in whenever the rail's own button is off screen.

The spacing rhythm is a 4px base. Cards use 20px horizontal padding (24px at `sm`) with 16–20px vertical padding, form sections use 20px, and stacked sections are 24px apart. Timeline rows share one grid template: a 36px label gutter, the plot, and a 52px value gutter (a 28px gutter and no value column below `sm`). Plot areas therefore align pixel for pixel across the CPU row, the axis and every process lane. The Burst Time list moves to two columns once there are 6 or more processes.

The playback toolbar sticks directly under the 56px app bar (top 3.5rem) at the head of the results column. It sits on a Page Black band with 12px of top padding, so cards scrolling beneath never show through above it. Inside each result card, the queue view and the collapsible step table follow the timeline. The Quantum Sweep chart is a full-width card below the results, with a 232px plot, a 38px left axis gutter and a 76px right gutter for reference-line labels.

**Presentation mode** enters fullscreen, raises the root font size to 18px, hides the settings rail and the shortcut hint once results exist, and narrows the container to 1200px in a single column. **Print** hides the app bar, settings, playback toolbar, queue views and mobile bar. It expands every step table, drops the container width and padding, keeps result cards from breaking across pages, and uses a 14mm page margin.

## Elevation & Depth

The system is flat and uses tonal layering. Depth comes from three ground steps (page → card → raised or accent) plus 1px hairline strokes. Cards carry a 10% foreground ring instead of a shadow. Overlays (tooltips) invert to a Near-White ground rather than lifting on a shadow.

### Named Rules
**The Hairline-Not-Shadow Rule.** Separate with a 6–8% white stroke or a one-step surface change, never with a drop shadow.

## Shapes

Corners are gently squared. Containers use 10px (cards, error summary), controls use 8px (buttons, inputs, steppers, table frame) and 6px for small buttons and toggles, and badges use 5px. Data marks are tighter: 4px for Gantt segments and the time scrubber band, 3px for run bars, legend squares and the time flag, and 2px for wait bars and legend chips. Horizontal bars round only on their value end (`rounded-r`) and stay square at the zero baseline. The app mark is a 24px rounded square that holds a three-row mini Gantt. Queue chips use 6px and the playback toolbar 10px. The playback slider is a 4px track at 2px radius with a 6×16px Near-White playhead bar (2px radius), which is a playhead rather than a round knob.

### Named Rules
**The No-Pill Rule.** Nothing is fully rounded. Badges are 5px, and no container goes past 10px.

## Components

### Buttons
Quiet and exact.
- **Shape:** 8px at default and large sizes, 6px at small.
- **Primary:** Near-White fill with Page Black text. Used once per context (the Calculate button, 40px high, bold). Hover drops to 80% opacity. Active nudges 1px down.
- **Outline:** a 12% input stroke over a 30% input tint, used for secondary entry points (the SET-A loader, trying the sample).
- **Secondary:** the Secondary Surface fill, used for the inline "recalculate" in the stale-results notice.
- **Ghost:** muted ink with no fill, used for Reset and Reshuffle.
- **Icon:** 32px square. Playback uses one primary icon button (play, pause, or restart at the end) and ghost icon buttons in muted ink for stepping back and forward. Each has a tooltip and an aria-label.
- **Focus:** a 3px ring at 50% of the focus-ring colour, with a matching border. Large composite regions (the step-table trigger and the Quantum Sweep plot) use a 2px ring at 50%.

### Chips / Toggles
- **Preset toggle group** (3 · 5 · 10): an outline group joined with no gap, with mono digits. The selected item fills with the muted surface.
- **Badge:** 5px radius, 20px high, and the outline variant for metadata such as `q = 2`.
- **Kbd:** 20px keys on the muted surface in the app-bar shortcut hint.
- **Speed toggle** (0.5× · 1× · 2× · 4×): the same joined outline group, 28px high with 40px items, shown at `sm` and wider. Below `sm` it collapses to one 28px outline button that cycles through the speeds.

### Cards / Containers
- **Corner Style:** 10px.
- **Background:** Card Graphite with a 10% foreground ring.
- **Header:** separated from the body by a bottom border, with 16px vertical padding.
- **Algorithm option rows:** 8px bordered rows. When checked they move to the Raised Surface with a 15% foreground border, and the series square dims to 40% when unchecked.

### Inputs / Fields
- **Style:** 32px high, 8px radius, a 12% input stroke over a 30% tint, right-aligned mono numerals.
- **Read-only (random mode):** a borderless Raised Surface well that still shows the value used.
- **Number stepper:** a joined − / value / + control with a 32px square hit area on each side. Native spinners are hidden.
- **Focus:** the border shifts to the ring colour plus a 3px ring at 50%.
- **Error:** a 60% Error Red border and a 25% red ring, with 12px red text below the field that is linked by `aria-describedby`.

### Navigation
- **App bar:** a 56px sticky bar on Page Black with a bottom border. It holds the mark, the 15px bold product name (h1), a muted tagline from `md`, the Cmd/Ctrl + Enter hint from `lg`, and the outline SET-A button.

### Gantt Timeline (signature)
A textbook Gantt that doubles as a scrubbable instrument.
- **CPU row:** 44px neutral segments, 4px radius and 1px gaps, with bold labels (10px when a segment is under 30px wide, and hidden under 15px). Hover moves to the accent surface. The focused process is Near-White with Page Black text.
- **Axis:** a 1px baseline with a 6px tick and a mono 11px number at every segment boundary. Ticks are thinned to a 22px minimum gap.
- **Process lanes:** a 1px rail that runs until CT, series-colour run bars (16px, 3px radius), 6px wait bars at 14% ink, a 50% ink CT tick, and `WT n` in the right gutter.
- **Shared cursor:** pointer or arrow keys select one time unit. That unit is drawn as a band with an 80% ink border over 8% ink in every row of every algorithm, with a Near-White mono time flag on the axis and a polite live readout ("P2 using the CPU · waiting P1, P3 · done P4").
- **Focus:** hovering or clicking a process in any chart or table focuses it everywhere, following the Emphasis-Not-Palette Rule.

### Playback Toolbar
A transport bar for the shared time cursor.
- **Container:** Card Graphite with a border, 10px radius, and 8×8px padding (10×16px at `sm`), in a role="toolbar".
- **Order:** transport buttons, then a flexible slider with a right-aligned readout (mono `t–t+1 / total` in 12px), then speed.
- **Slider:** a 4px Accent Surface track, a Near-White range, and the playhead thumb. Its hit area extends 12px sideways and 8px vertically. Hover and focus add a 3px ring at 50%. Dragging pauses playback.

### Queue View
The scheduler's state at the current time unit, inside each result card.
- **Panel:** Raised Surface with a border and 8px radius. A header row (bold 14px "state at t–t+1", a done count, and a polite live line explaining the choice) sits above three slots: CPU, the ready queue (chips joined by subtle arrows), and done.
- **Chips:** 36px high, at least 52px wide, 6px radius, with a bold 14px `Pn` over an 11px caption. Waiting chips sit on the Accent Surface with a border. Done chips are transparent with a hairline, muted ink and a check. The CPU chip follows the Filled-Chip Exception. A focused waiting or done chip lifts to Near-White; a focused CPU chip keeps its hue (it is the data mark) and shows focus as a 2px Near-White ring with a 2px offset on the panel surface.
- **Progress strip:** 2px along the chip's bottom edge, showing CPU time used (a 45% ink fill on a 10% track, or a 70% Page Black fill on a 25% track on filled chips).
- **Motion:** chips move between slots with FLIP (320ms, cubic-bezier(0.16, 1, 0.3, 1)) and enter at 92% scale with a fade (200ms). Both are off under reduced motion.

### Step Table
The hand-calculation table, one per result card, collapsed by default.
- **Trigger:** a full-width 8px bordered row with a bold title, a 12px step count, and a chevron that rotates over 200ms. Hover moves to the Raised Surface.
- **Table:** 13px text. The header is on the Raised Surface with bold 12px muted labels at 36px. Columns are step, time, queue before choice, choice · reason, remaining (`before → after`), and outcome. Digits are mono.
- **Rows:** clicking or pressing Enter on a row moves the shared cursor to that step. The focused-process row uses the Accent Surface (as in the result table). The current-time row uses the Raised Surface plus a small filled play marker before the step number.
- **Mounting:** content is always mounted and hidden with CSS when closed, so print can force it open.

### Quantum Sweep
An SVG line chart of RR AVG WT against q = 1…max BT (capped at 100), compared with the other algorithms.
- **Series:** a 2px RR orange line with round joins. Every q gets an r=4 dot with a 2px Card Graphite ring. The hovered or current q grows to r=6, and the current q fills Near-White.
- **References:** FCFS and SJF are 2px horizontal lines at 80% opacity, labelled in 11px muted ink in the 76px right gutter. The labels are dropped when they would collide, and the legend still names both.
- **Axes:** a single y-axis from 0 on a nice 0.5–100 step scale, hairline gridlines with a border-weight baseline, and 11px mono ticks in Subtle Ink (the current q tick is in ink). A 1px 40% ink cursor line follows the pointer.
- **Interaction:** pointer or arrow keys preview a q, and clicking or pressing Enter recalculates with it. A screen-reader table lists every point.

### Result Table
The assignment grammar is Process | BT | ST | CT | TAT | WT, inside a bordered 8px frame. The header sits on the Raised Surface with dotted-underline abbreviations that carry tooltips. The body is mono tabular. CT and WT are in ink, WT is semibold, and the other columns are muted. The footer shows averages, then a formula line (`AVG WT = ΣWT ÷ n = …`).

### Comparison Summary
Shown when two or more algorithms are selected. On the left, AVG WT bars start at zero and are ranked by value. The best bar is at full opacity and the others at 70%, and the best value is marked with a check icon and a text label. On the right is a per-process WT chart on a shared 3–5 step "nice" axis, with 6% hairline gridlines and values placed at bar ends. A one-sentence insight is always computed from the real numbers.

### Motion
State transitions (colour, opacity, background) take 150ms, and the bottom bar slides in 200ms. Result cards rise 6px over 240ms, staggered by 60ms. The timeline plots get one left-to-right clip wipe (520ms, cubic-bezier(0.16, 1, 0.3, 1)) after each calculation. Queue chips FLIP between slots over 320ms and enter over 200ms (same curve), and the step-table chevron rotates over 200ms. Playback advances the shared cursor at 0.5–4× only after the user presses play. All motion collapses under `prefers-reduced-motion` (the FLIP hook checks it directly), and print disables all animation and transition.

**The One-Wipe Rule.** The only entrance flourish is the timeline reveal after calculating. Other motion answers a change in time state. Nothing loops, pulses or animates while idle.

**The Two-Channels Rule.** Time state and process focus never share a treatment. The current time is a band, a Raised Surface row, or a filled play marker. The focused process is Near-White or the Accent Surface.

## Do's and Don'ts

### Do:
- **Do** put algorithm colour on marks only (bars, legend squares, run bars) and keep every label in ink tokens (Color-Is-Data Rule).
- **Do** draw every algorithm on the same time scale and the same timeline row grid, so the plot areas align across rows and cards.
- **Do** show focus through emphasis: Near-White for the focused Gantt segment, the accent surface for focused rows, and 45% opacity for everything else.
- **Do** set column and axis digits in Geist Mono with tabular numbers, and everything else in LINE Seed 400/700.
- **Do** separate with hairlines (6–8% white) and one-step surface changes.
- **Do** keep text contrast at or above Subtle Ink (5.1:1 on card).
- **Do** start every bar chart at zero, and round only the value end. Line charts use one y-axis from 0.
- **Do** keep the current-time highlight (Raised Surface plus the play marker) separate from process focus (the Accent Surface or Near-White).

### Don't:
- **Don't** use pill or fully rounded shapes. Badges are 5px, and containers cap at 10px.
- **Don't** give processes a cycling categorical palette.
- **Don't** colour text, borders or control grounds with FCFS blue, SJF aqua or RR orange. The CPU chip is the only filled data mark that carries text, and its text is Page Black.
- **Don't** use Error Red for anything other than validation errors.
- **Don't** add drop shadows, decorative gradients or glass blur.
- **Don't** use emoji as UI, or a terminal or console aesthetic.
- **Don't** add idle or looping animation. The timeline wipe after calculating is the only entrance flourish.

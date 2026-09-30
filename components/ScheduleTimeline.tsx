"use client";

import type { KeyboardEvent, PointerEvent, ReactNode } from "react";

import { ALGORITHM_META } from "./algorithm-styles";
import { useTimeline } from "./timeline-context";
import { useElementWidth } from "./use-element-width";
import {
  boundaryTicks,
  processAt,
  runIntervals,
  waitIntervals,
  waitingAt,
} from "@/lib/scheduling/timeline";
import type { SimulationResult } from "@/lib/scheduling/types";
import { cn } from "@/lib/utils";

/** ระยะห่างขั้นต่ำระหว่างตัวเลขบนแกน (px) และความกว้างขั้นต่ำที่ใส่ label ในแท่งได้ */
const MIN_TICK_GAP_PX = 22;
const MIN_LABEL_PX = 15;
const COMPACT_LABEL_PX = 30;

const pct = (t: number, total: number) => `${(t / total) * 100}%`;

/**
 * แถวหนึ่งของไทม์ไลน์: gutter ซ้าย (ชื่อแถว) · พื้นที่พล็อต · gutter ขวา (ค่าสรุป)
 * ทุกแถวใช้ grid template เดียวกัน พื้นที่พล็อตจึงตรงกันทุกแถวแบบพิกเซลต่อพิกเซล
 */
function Row({
  label,
  end,
  className,
  plotClassName,
  children,
  onPointerEnter,
  focused,
  dimmed,
}: {
  label: ReactNode
  end?: ReactNode
  className?: string
  plotClassName?: string
  children: ReactNode
  onPointerEnter?: () => void
  focused?: boolean
  dimmed?: boolean
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-x-2 transition-opacity duration-150 sm:grid-cols-[2.25rem_minmax(0,1fr)_3.25rem] sm:gap-x-3",
        dimmed && "opacity-45",
        className
      )}
      onPointerEnter={onPointerEnter}
    >
      <div
        className={cn(
          "text-xs transition-colors",
          focused ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
      </div>
      <div className={cn("relative", plotClassName)}>{children}</div>
      <div className="hidden text-right text-xs text-muted-foreground sm:block">{end}</div>
    </div>
  );
}

/** แถบไฮไลต์หน่วยเวลาที่เคอร์เซอร์ชี้ — วาดซ้ำในทุกแถวที่ตำแหน่งเดียวกัน */
function CursorBand({ cursor, total }: { cursor: number | null; total: number }) {
  if (cursor === null) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-[-4px] z-10 border-x border-foreground/80 bg-foreground/[0.08]"
      style={{ left: pct(cursor, total), width: pct(1, total) }}
    />
  );
}

/**
 * Gantt แบบตำราเรียน + แถวราย process ของอัลกอริทึมเดียว
 * - แถว CPU: segment เรียงต่อกัน เลขเวลาใต้ทุกขอบ segment (แบบที่ผู้ตรวจเทียบกับการคำนวณมือ)
 * - แถว P1…Pn: ช่วงได้ CPU = แท่งสีอัลกอริทึม, ช่วงรอ = แถบจางบาง, ค่า WT ที่ขอบขวา
 * - เคอร์เซอร์เวลา (pointer หรือ ←/→) ใช้ร่วมกับทุกอัลกอริทึมผ่าน TimelineProvider
 */
export default function ScheduleTimeline({ result }: { result: SimulationResult }) {
  const { focus, setHover, togglePin, cursor, held, setHeld, setHoverCursor, pause, total } =
    useTimeline();
  const [plotRef, plotWidth] = useElementWidth<HTMLDivElement>();
  const meta = ALGORITHM_META[result.algorithm];
  const { gantt, processes } = result;

  const ticks = boundaryTicks(gantt, plotWidth > 0 ? MIN_TICK_GAP_PX / plotWidth : 0.06);
  const completionTimes = processes.map((p) => p.completionTime);

  const running = cursor === null ? null : processAt(gantt, cursor + 0.5);
  const waiting = cursor === null ? [] : waitingAt(gantt, completionTimes, cursor + 0.5);
  const done =
    cursor === null ? [] : processes.filter((p) => p.completionTime <= cursor).map((p) => p.id);

  function cursorFromPointer(e: PointerEvent<HTMLDivElement>) {
    const rect = plotRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const x = (e.clientX - rect.left) / rect.width;
    if (x < 0 || x >= 1) {
      setHoverCursor(null);
      return;
    }
    setHoverCursor(Math.min(total - 1, Math.max(0, Math.floor(x * total))));
  }

  // ปุ่มลูกศรเลื่อน "เวลาที่ถือไว้" ร่วมกับตัวเล่น — ทุกอัลกอริทึมตามไปด้วย
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? Math.max(1, Math.round(total / 10)) : 1;
    let next: number | null | undefined;
    if (e.key === "ArrowRight") next = held === null ? 0 : held + step;
    else if (e.key === "ArrowLeft") next = held === null ? total - 1 : held - step;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = total - 1;
    else if (e.key === "Escape") next = null;
    if (next === undefined) return;
    e.preventDefault();
    pause();
    setHeld(next);
  }

  const readoutId = `timeline-readout-${result.algorithm}`;

  /** เลขแกนที่อยู่ใต้ธงเวลา (ธงกว้างราว 40px รอบกึ่งกลางช่วงที่ชี้) */
  const underFlag = (t: number) =>
    cursor !== null && plotWidth > 0 && Math.abs(((t - (cursor + 0.5)) / total) * plotWidth) < 22;

  return (
    <figure className="space-y-3">
      <figcaption className="flex min-h-5 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-sm font-bold text-foreground">Gantt Chart</span>
        <span id={readoutId} aria-live="polite" className="text-xs text-muted-foreground">
          {cursor === null ? (
            <span className="hidden sm:inline">ชี้หรือใช้ปุ่มลูกศรเพื่อดูสถานะแต่ละหน่วยเวลา</span>
          ) : (
            <>
              <span className="font-mono tabular text-foreground">
                {cursor}–{cursor + 1}
              </span>
              <span className="mx-1.5 text-subtle">·</span>
              {running !== null ? (
                <>
                  <span className="text-foreground">P{running}</span> ใช้ CPU
                </>
              ) : (
                "CPU ว่าง"
              )}
              <span className="mx-1.5 text-subtle">·</span>
              {waiting.length > 0 ? `รอคิว ${waiting.map((id) => `P${id}`).join(", ")}` : "ไม่มีใครรอ"}
              {done.length > 0 && (
                <>
                  <span className="mx-1.5 text-subtle">·</span>
                  เสร็จแล้ว {done.map((id) => `P${id}`).join(", ")}
                </>
              )}
            </>
          )}
        </span>
      </figcaption>

      <div
        role="group"
        tabIndex={0}
        aria-label={`ไทม์ไลน์ ${meta.name} ${total} หน่วยเวลา — ใช้ปุ่มลูกศรซ้ายขวาเลื่อนเวลา`}
        aria-describedby={readoutId}
        onKeyDown={onKeyDown}
        onPointerMove={cursorFromPointer}
        onPointerDown={(e) => {
          const rect = plotRef.current?.getBoundingClientRect();
          if (!rect || rect.width === 0) return;
          const x = (e.clientX - rect.left) / rect.width;
          if (x >= 0 && x < 1) {
            pause();
            setHeld(Math.floor(x * total));
          }
        }}
        onPointerLeave={() => {
          setHoverCursor(null);
          setHover(null);
        }}
        className="-mx-2 rounded-lg px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {/* แถว CPU — Gantt แบบตำราเรียน */}
        <Row label="CPU" plotClassName="h-11">
          <div ref={plotRef} className="absolute inset-0 animate-reveal-x">
            {gantt.map((seg, i) => {
              const widthPx = ((seg.end - seg.start) / total) * plotWidth;
              const isFocus = focus === seg.processId;
              return (
                <button
                  key={i}
                  type="button"
                  tabIndex={-1}
                  onPointerEnter={() => setHover(seg.processId)}
                  onClick={() => togglePin(seg.processId)}
                  aria-label={`P${seg.processId} ใช้ CPU ช่วง ${seg.start} ถึง ${seg.end}`}
                  className="absolute inset-y-0 px-px"
                  style={{ left: pct(seg.start, total), width: pct(seg.end - seg.start, total) }}
                >
                  <span
                    className={cn(
                      "flex h-full items-center justify-center rounded-[4px] font-bold transition-colors duration-150",
                      widthPx < COMPACT_LABEL_PX ? "text-[10px] leading-none tracking-[-0.02em]" : "text-xs leading-none",
                      isFocus
                        ? "bg-foreground text-background"
                        : "bg-segment text-segment-ink hover:bg-surface-3",
                      focus !== null && !isFocus && "text-segment-ink/60"
                    )}
                  >
                    {widthPx >= MIN_LABEL_PX && `P${seg.processId}`}
                  </span>
                </button>
              );
            })}
          </div>
          <CursorBand cursor={cursor} total={total} />
        </Row>

        {/* แกนเวลา: ขีดและเลขทุกขอบ segment */}
        <Row label="" plotClassName="h-6" className="mb-3">
          <div className="absolute inset-x-0 top-0 h-px bg-border" />
          {ticks.map((t) => (
            <div
              key={t}
              className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
              style={{ left: pct(t, total) }}
            >
              <span className="h-1.5 w-px bg-subtle/70" />
              <span
                className={cn(
                  "mt-0.5 font-mono text-[11px] leading-none tabular text-subtle transition-opacity duration-100",
                  underFlag(t) && "opacity-0"
                )}
              >
                {t}
              </span>
            </div>
          ))}
          {/* ธงเวลาบนแกน — บอกช่วงที่เคอร์เซอร์ชี้ อ่านได้จากระยะไกล */}
          {cursor !== null && (
            <div
              aria-hidden
              className="absolute top-0 z-20 flex -translate-x-1/2 justify-center"
              style={{ left: pct(cursor + 0.5, total) }}
            >
              <span className="rounded-[3px] bg-foreground px-1.5 py-0.5 font-mono text-[11px] leading-none font-medium whitespace-nowrap tabular text-background">
                {cursor}–{cursor + 1}
              </span>
            </div>
          )}
        </Row>

        {/* แถวราย process: ได้ CPU (สีอัลกอริทึม) กับ รอ (แถบจาง) */}
        <div className="space-y-1.5 border-t border-hairline pt-3">
          {processes.map((p) => {
            const runs = runIntervals(gantt, p.id);
            const waits = waitIntervals(gantt, p.id, p.completionTime);
            const isFocus = focus === p.id;
            return (
              <Row
                key={p.id}
                label={`P${p.id}`}
                end={
                  <span className={cn(isFocus && "text-foreground")}>
                    <span className="text-subtle">WT </span>
                    <span className="font-mono tabular">{p.waitingTime}</span>
                  </span>
                }
                plotClassName="h-4"
                focused={isFocus}
                dimmed={focus !== null && !isFocus}
                onPointerEnter={() => setHover(p.id)}
              >
                <div className="absolute inset-0 animate-reveal-x">
                  {/* ราง: เส้นบางตลอดช่วงที่โปรเซสยังอยู่ในระบบ */}
                  <div
                    className="absolute top-1/2 h-px -translate-y-1/2 bg-border"
                    style={{ left: 0, width: pct(p.completionTime, total) }}
                  />
                  {waits.map((w) => (
                    <div
                      key={`w${w.start}`}
                      className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-[2px] bg-foreground/[0.14]"
                      style={{ left: pct(w.start, total), width: pct(w.end - w.start, total) }}
                    />
                  ))}
                  {runs.map((r) => (
                    <div
                      key={`r${r.start}`}
                      className="absolute inset-y-0 px-px"
                      style={{ left: pct(r.start, total), width: pct(r.end - r.start, total) }}
                    >
                      <div className={cn("h-full rounded-[3px]", meta.fill)} />
                    </div>
                  ))}
                  {/* ขีดบอก CT */}
                  <div
                    className="absolute inset-y-[-2px] w-px bg-foreground/50"
                    style={{ left: `calc(${pct(p.completionTime, total)} - 1px)` }}
                  />
                </div>
                <CursorBand cursor={cursor} total={total} />
              </Row>
            );
          })}
        </div>
      </div>

      {/* คำอธิบายสัญลักษณ์ — identity ไม่พึ่งสีอย่างเดียว */}
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground sm:pl-[3rem]">
        <li className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className={cn("h-2.5 w-4 rounded-[2px]", meta.fill)} aria-hidden />
          ได้ใช้ CPU
        </li>
        <li className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className="h-1.5 w-4 rounded-[2px] bg-foreground/[0.14]" aria-hidden />
          รออยู่ในคิว (รวม = WT)
        </li>
        <li className="inline-flex items-center gap-1.5 whitespace-nowrap">
          {/* สัญลักษณ์เดียวกับขีด CT บนราง: รางบาง + ขีดตั้ง */}
          <span className="relative h-3 w-4" aria-hidden>
            <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
            <span className="absolute inset-y-0 right-1 w-px bg-foreground/50" />
          </span>
          เสร็จ (CT)
        </li>
      </ul>
    </figure>
  );
}

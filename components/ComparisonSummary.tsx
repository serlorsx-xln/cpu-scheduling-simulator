"use client";

import { Check } from "lucide-react";

import { ALGORITHM_META } from "./algorithm-styles";
import { useTimeline } from "./timeline-context";
import type { SimulationResult } from "@/lib/scheduling/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const format2 = (n: number) => n.toFixed(2);

/** ประโยคสรุปจากตัวเลขจริง — ไม่มีคำอ้างเกินข้อมูล */
function insight(results: SimulationResult[]): string {
  const sorted = [...results].sort((a, b) => a.avgWaitingTime - b.avgWaitingTime);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const bestNames = sorted
    .filter((r) => r.avgWaitingTime === best.avgWaitingTime)
    .map((r) => ALGORITHM_META[r.algorithm].name);

  if (best.avgWaitingTime === worst.avgWaitingTime) {
    return `ทุกอัลกอริทึมมีเวลารอเฉลี่ยเท่ากัน (${format2(best.avgWaitingTime)}) กับชุดข้อมูลนี้`;
  }
  const gap = format2(worst.avgWaitingTime - best.avgWaitingTime);
  const lead =
    bestNames.length > 1
      ? `${bestNames.join(" และ ")} มีเวลารอเฉลี่ยต่ำสุดเท่ากัน (${format2(best.avgWaitingTime)})`
      : `${bestNames[0]} มีเวลารอเฉลี่ยต่ำสุด (${format2(best.avgWaitingTime)})`;
  return `${lead} — น้อยกว่า ${ALGORITHM_META[worst.algorithm].name} ${gap} หน่วยเวลา`;
}

/**
 * แผงเปรียบเทียบ (แสดงเมื่อเลือก ≥ 2 อัลกอริทึม)
 * 1) AVG WT ต่ออัลกอริทึม: แท่งแนวนอนเริ่มที่ 0 เสมอ ค่าอยู่คอลัมน์ขวาเรียงตรงกัน
 * 2) WT รายโปรเซส: แถวละโปรเซส แท่งย่อยต่ออัลกอริทึม สเกลร่วมกัน
 */
export default function ComparisonSummary({ results }: { results: SimulationResult[] }) {
  const { focus, setHover, togglePin } = useTimeline();
  if (results.length < 2) return null;

  const best = Math.min(...results.map((r) => r.avgWaitingTime));
  const maxAvg = Math.max(...results.map((r) => r.avgWaitingTime), 0);
  const maxWt = Math.max(...results.flatMap((r) => r.processes.map((p) => p.waitingTime)), 0);
  const processIds = results[0].processes.map((p) => p.id);
  const scale = (v: number, max: number) => (max === 0 ? 0 : (v / max) * 100);

  // สเกลของกราฟรายโปรเซส: ขั้นหารสวย 3–5 ขีด เริ่มที่ 0 เสมอ
  const step = [1, 2, 5, 10, 20, 25, 50, 100].find((s) => Math.ceil(maxWt / s) <= 4) ?? 100;
  const axisMax = Math.max(step, Math.ceil(maxWt / step) * step);
  const axisTicks = Array.from({ length: axisMax / step + 1 }, (_, i) => i * step);

  return (
    <Card className="animate-rise gap-0 py-0">
      <CardHeader className="gap-1 border-b px-5 py-4 sm:px-6">
        <CardTitle className="text-base font-bold">เปรียบเทียบเวลารอ</CardTitle>
        <CardDescription>{insight(results)}</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-0 px-0 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* AVG WT ต่ออัลกอริทึม */}
        <section aria-labelledby="cmp-avg" className="px-5 py-5 sm:px-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 id="cmp-avg" className="text-sm font-bold text-foreground">
              AVG Waiting Time
            </h3>
            <span className="text-xs text-muted-foreground">ยิ่งสั้นยิ่งดี</span>
          </div>
          <ul className="space-y-4">
            {results.map((r) => {
              const meta = ALGORITHM_META[r.algorithm];
              const isBest = r.avgWaitingTime === best;
              return (
                <li key={r.algorithm}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <a
                      href={`#algo-${r.algorithm}`}
                      className="flex min-w-0 items-center gap-2 rounded-sm text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                      <span className={cn("size-2.5 shrink-0 rounded-[3px]", meta.fill)} aria-hidden />
                      <span className="truncate">{meta.name}</span>
                      {r.algorithm === "RR" && (
                        <span className="shrink-0 text-xs text-subtle">
                          q={r.timeQuantum}
                        </span>
                      )}
                    </a>
                    <span className="flex shrink-0 items-center gap-1.5">
                      {isBest && (
                        <span className="inline-flex items-center gap-1 text-xs text-foreground">
                          <Check className="size-3.5" aria-hidden />
                          ต่ำสุด
                        </span>
                      )}
                      <span className="w-12 text-right text-base font-bold text-foreground">
                        {format2(r.avgWaitingTime)}
                      </span>
                    </span>
                  </div>
                  <div
                    className="h-2.5 rounded-r-[4px] bg-surface-2"
                    role="img"
                    aria-label={`${meta.name} AVG WT ${format2(r.avgWaitingTime)}`}
                  >
                    <div
                      className={cn(
                        "h-full rounded-r-[4px] transition-[width] duration-200 ease-out",
                        meta.fill,
                        !isBest && "opacity-70"
                      )}
                      style={{ width: `${scale(r.avgWaitingTime, maxAvg)}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    AVG TAT{" "}
                    <span className="font-mono tabular text-foreground/80">
                      {format2(r.avgTurnaroundTime)}
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* WT รายโปรเซส */}
        <section
          aria-labelledby="cmp-per-process"
          className="border-t px-5 py-5 sm:px-6 lg:border-t-0 lg:border-l"
        >
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <h3 id="cmp-per-process" className="text-sm font-bold text-foreground">
              Waiting Time รายโปรเซส
            </h3>
            <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground" aria-label="คำอธิบายสี">
              {results.map((r) => (
                <li key={r.algorithm} className="inline-flex items-center gap-1.5">
                  <span className={cn("h-2 w-3 rounded-[2px]", ALGORITHM_META[r.algorithm].fill)} aria-hidden />
                  {ALGORITHM_META[r.algorithm].short}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative" onPointerLeave={() => setHover(null)}>
            {/* เส้นกริดแนวตั้งบาง ๆ ของสเกล — วางใต้แท่ง ตรงกับคอลัมน์พล็อต */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-8 left-[3.25rem]"
            >
              {axisTicks.map((t) => (
                <span
                  key={t}
                  className="absolute inset-y-0 w-px bg-hairline"
                  style={{ left: `${(t / axisMax) * 100}%` }}
                />
              ))}
            </div>

            <ul className="relative space-y-0.5">
              {processIds.map((id) => {
                const isFocus = focus === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onPointerEnter={() => setHover(id)}
                      onFocus={() => setHover(id)}
                      onBlur={() => setHover(null)}
                      onClick={() => togglePin(id)}
                      aria-label={`P${id}: ${results
                        .map((r) => `${r.algorithm} WT ${r.processes[id - 1].waitingTime}`)
                        .join(", ")}`}
                      className={cn(
                        "grid w-full grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-2 rounded-md py-1.5 pr-8 pl-2 text-left transition-[background-color,opacity] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                        isFocus ? "bg-accent" : "hover:bg-surface-2",
                        focus !== null && !isFocus && "opacity-45"
                      )}
                    >
                      <span className="text-xs text-foreground">P{id}</span>
                      <span className="space-y-1">
                        {results.map((r) => {
                          const wt = r.processes[id - 1].waitingTime;
                          return (
                            <span key={r.algorithm} className="relative flex h-2 items-center">
                              <span
                                className={cn(
                                  "h-full shrink-0 rounded-r-[3px]",
                                  ALGORITHM_META[r.algorithm].fill
                                )}
                                style={{ width: `${(wt / axisMax) * 100}%` }}
                              />
                              {/* ค่าอยู่ปลายแท่งเสมอ — ไม่แยกเป็นคอลัมน์ */}
                              <span className="ml-1.5 font-mono text-xs leading-none font-medium tabular text-foreground">
                                {wt}
                              </span>
                            </span>
                          );
                        })}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* แกนสเกล */}
            <div aria-hidden className="relative mt-1 mr-8 ml-[3.25rem] h-4 border-t border-border">
              {axisTicks.map((t) => (
                <span
                  key={t}
                  className="absolute top-1 -translate-x-1/2 font-mono text-[11px] leading-none tabular text-subtle"
                  style={{ left: `${(t / axisMax) * 100}%` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

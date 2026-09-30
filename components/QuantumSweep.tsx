"use client";

import { useMemo, useState, type KeyboardEvent } from "react";

import { ALGORITHM_META } from "./algorithm-styles";
import { useElementWidth } from "./use-element-width";
import { runSimulation } from "@/lib/scheduling/simulate";
import { quantumSweep } from "@/lib/scheduling/trace";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const HEIGHT = 232;
const M = { top: 14, right: 76, bottom: 34, left: 38 };
const format2 = (n: number) => n.toFixed(2);
/** เพดานจำนวนจุด — BT ใหญ่มาก (เช่น 500) ไม่ต้องจำลองหลายร้อยรอบ */
const Q_CAP = 100;

/** ขั้นหารสวยสำหรับแกน y (เริ่ม 0 เสมอ) */
function niceScale(max: number) {
  const step = [0.5, 1, 2, 2.5, 5, 10, 20, 25, 50, 100].find((s) => max / s <= 5) ?? 100;
  const top = Math.max(step, Math.ceil(max / step) * step);
  return { top, ticks: Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step) };
}

/**
 * AVG WT ของ Round Robin เมื่อ q = 1…BT สูงสุด เทียบเส้นอ้างอิง FCFS / SJF บนแกนเดียวกัน
 * จุด = ค่าที่คำนวณจริงด้วย runSimulation ตัวเดียวกับการ์ด · คลิกจุดเพื่อคำนวณใหม่ด้วย q นั้น
 */
export default function QuantumSweep({
  burstTimes,
  currentQuantum,
  onPickQuantum,
}: {
  burstTimes: number[]
  currentQuantum: number
  onPickQuantum: (q: number) => void
}) {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const btKey = burstTimes.join(",");
  const { points, fcfs, sjf } = useMemo(() => {
    const qMax = Math.min(Q_CAP, Math.max(Math.max(...burstTimes), currentQuantum));
    const processes = burstTimes.map((bt, i) => ({ id: i + 1, burstTime: bt }));
    const [f, s] = runSimulation({ processes, timeQuantum: 1, algorithms: ["FCFS", "SJF"] });
    return { points: quantumSweep(burstTimes, qMax), fcfs: f.avgWaitingTime, sjf: s.avgWaitingTime };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- เทียบ BT ด้วยค่า (btKey) ไม่ใช่ reference
  }, [btKey, currentQuantum]);

  const maxBt = Math.max(...burstTimes);
  const qMax = points.length;
  const capped = Math.max(maxBt, currentQuantum) > Q_CAP;
  const { top, ticks } = niceScale(Math.max(fcfs, sjf, ...points.map((p) => p.avgWaitingTime), 0.5));
  const plotW = Math.max(0, width - M.left - M.right);
  const plotH = HEIGHT - M.top - M.bottom;
  const x = (q: number) => M.left + (qMax === 1 ? plotW / 2 : ((q - 1) / (qMax - 1)) * plotW);
  const y = (v: number) => M.top + plotH - (v / top) * plotH;

  const bestWt = Math.min(...points.map((p) => p.avgWaitingTime));
  const bestQs = points.filter((p) => p.avgWaitingTime === bestWt).map((p) => p.quantum);
  const current = points.find((p) => p.quantum === currentQuantum);
  const shown = points.find((p) => p.quantum === (active ?? currentQuantum)) ?? points[0];
  // x-ticks: ทุกค่าเมื่อจุดไม่แน่นเกิน ไม่งั้นเว้นเป็นช่วง
  const xEvery = Math.max(1, Math.ceil(qMax / Math.max(1, Math.floor(plotW / 28))));

  function qFromClientX(clientX: number) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || plotW <= 0) return null;
    const rel = (clientX - rect.left - M.left) / plotW;
    return Math.min(qMax, Math.max(1, Math.round(rel * (qMax - 1)) + 1));
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const cur = active ?? currentQuantum;
    if (e.key === "ArrowRight") setActive(Math.min(qMax, cur + 1));
    else if (e.key === "ArrowLeft") setActive(Math.max(1, cur - 1));
    else if (e.key === "Enter" && active !== null) onPickQuantum(active);
    else if (e.key === "Escape") setActive(null);
    else return;
    e.preventDefault();
  }

  const rrPath = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.quantum)},${y(p.avgWaitingTime)}`).join(" ");
  const refLines = [
    { key: "FCFS" as const, value: fcfs },
    { key: "SJF" as const, value: sjf },
  ];
  const labelsCollide = Math.abs(y(fcfs) - y(sjf)) < 13;

  return (
    <Card className="animate-rise gap-0 py-0">
      <CardHeader className="gap-1 border-b px-5 py-4 sm:px-6">
        <CardTitle className="text-base font-bold">Time Quantum มีผลอย่างไร</CardTitle>
        <CardDescription>
          AVG WT ของ Round Robin เมื่อ q = 1 ถึง {qMax} ต่ำสุดที่ q ={" "}
          {bestQs.join(", ")} ({format2(bestWt)}) · ตั้งแต่ q = {maxBt} (BT มากสุด) ขึ้นไป ไม่มีโปรเซสถูกแทรก
          RR จึงเท่ากับ FCFS ({format2(fcfs)})
          {capped && ` · แสดงถึง q = ${Q_CAP}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-5 py-5 sm:px-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-label="คำอธิบายเส้น">
            <li className="inline-flex items-center gap-1.5">
              <span className={cn("h-0.5 w-4 rounded-[1px]", ALGORITHM_META.RR.fill)} aria-hidden />
              Round Robin (ตาม q)
            </li>
            {refLines.map((r) => (
              <li key={r.key} className="inline-flex items-center gap-1.5">
                <span className={cn("h-0.5 w-4 rounded-[1px] opacity-80", ALGORITHM_META[r.key].fill)} aria-hidden />
                {ALGORITHM_META[r.key].short} (ไม่ขึ้นกับ q)
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground" aria-live="polite">
            q = <span className="font-mono tabular text-foreground">{shown.quantum}</span>
            <span className="mx-1.5 text-subtle">·</span>
            RR <span className="font-mono tabular text-foreground">{format2(shown.avgWaitingTime)}</span>
            {shown.quantum === currentQuantum ? (
              <span className="ml-1.5 text-subtle">(ค่าที่ใช้อยู่)</span>
            ) : (
              <span className="ml-1.5 text-subtle">— คลิกเพื่อใช้ q นี้</span>
            )}
          </p>
        </div>

        <div
          ref={wrapRef}
          role="group"
          tabIndex={0}
          aria-label={`กราฟเส้น AVG WT ของ Round Robin ตาม Time Quantum 1 ถึง ${qMax} ใช้ลูกศรซ้ายขวาเลือก q และ Enter เพื่อคำนวณใหม่`}
          onKeyDown={onKeyDown}
          onPointerMove={(e) => setActive(qFromClientX(e.clientX))}
          onPointerLeave={() => setActive(null)}
          onClick={(e) => {
            const q = qFromClientX(e.clientX);
            if (q !== null && q !== currentQuantum) onPickQuantum(q);
          }}
          className="relative -mx-1 cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          style={{ height: HEIGHT }}
        >
          {width > 0 && (
            <svg width={width} height={HEIGHT} className="block overflow-visible" aria-hidden>
              {/* กริดแนวนอน + ค่าแกน y */}
              {ticks.map((t) => (
                <g key={t}>
                  <line
                    x1={M.left}
                    x2={M.left + plotW}
                    y1={y(t)}
                    y2={y(t)}
                    className={t === 0 ? "stroke-border" : "stroke-hairline"}
                    strokeWidth={1}
                  />
                  <text
                    x={M.left - 8}
                    y={y(t)}
                    dy="0.32em"
                    textAnchor="end"
                    className="fill-subtle font-mono text-[11px] tabular"
                  >
                    {t % 1 === 0 ? t : t.toFixed(1)}
                  </text>
                </g>
              ))}

              {/* แกน x: ค่า q */}
              {points.map((p) =>
                (p.quantum - 1) % xEvery === 0 || p.quantum === qMax ? (
                  <text
                    key={p.quantum}
                    x={x(p.quantum)}
                    y={HEIGHT - M.bottom + 16}
                    textAnchor="middle"
                    className={cn(
                      "font-mono text-[11px] tabular",
                      p.quantum === currentQuantum ? "fill-foreground" : "fill-subtle"
                    )}
                  >
                    {p.quantum}
                  </text>
                ) : null
              )}
              <text
                x={M.left + plotW}
                y={HEIGHT - 2}
                textAnchor="end"
                className="fill-subtle text-[11px]"
              >
                Time Quantum (q)
              </text>

              {/* เส้นอ้างอิง FCFS / SJF */}
              {refLines.map((r) => (
                <line
                  key={r.key}
                  x1={M.left}
                  x2={M.left + plotW}
                  y1={y(r.value)}
                  y2={y(r.value)}
                  stroke={ALGORITHM_META[r.key].cssVar}
                  strokeWidth={2}
                  strokeLinecap="round"
                  opacity={0.8}
                />
              ))}

              {/* เส้นเคอร์เซอร์ */}
              {active !== null && (
                <line
                  x1={x(active)}
                  x2={x(active)}
                  y1={M.top}
                  y2={M.top + plotH}
                  className="stroke-foreground/40"
                  strokeWidth={1}
                />
              )}

              {/* เส้น RR + จุดทุกค่า q */}
              <path
                d={rrPath}
                fill="none"
                stroke={ALGORITHM_META.RR.cssVar}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {points.map((p) => {
                const isCurrent = p.quantum === currentQuantum;
                const isActive = p.quantum === active;
                return (
                  <circle
                    key={p.quantum}
                    cx={x(p.quantum)}
                    cy={y(p.avgWaitingTime)}
                    r={isCurrent || isActive ? 6 : 4}
                    fill={isCurrent ? "var(--foreground)" : ALGORITHM_META.RR.cssVar}
                    stroke="var(--card)"
                    strokeWidth={2}
                  />
                );
              })}
            </svg>
          )}

          {/* ป้ายท้ายเส้นอ้างอิง — ข้ามเมื่อชนกัน (legend ยังบอกอยู่) */}
          {width > 0 &&
            !labelsCollide &&
            refLines.map((r) => (
              <span
                key={r.key}
                aria-hidden
                className="pointer-events-none absolute -translate-y-1/2 pl-2 text-[11px] leading-none whitespace-nowrap text-muted-foreground"
                style={{ left: M.left + plotW, top: y(r.value) }}
              >
                {ALGORITHM_META[r.key].short} <span className="font-mono tabular">{format2(r.value)}</span>
              </span>
            ))}
        </div>

        {/* ตารางค่าสำหรับ screen reader — ค่าทุกจุดอ่านได้โดยไม่ต้อง hover */}
        <table className="sr-only">
          <caption>AVG WT ของ Round Robin ตาม Time Quantum</caption>
          <thead>
            <tr>
              <th>q</th>
              <th>AVG WT</th>
              <th>AVG TAT</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.quantum}>
                <td>{p.quantum}</td>
                <td>{format2(p.avgWaitingTime)}</td>
                <td>{format2(p.avgTurnaroundTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {current && (
          <p className="mt-2 text-xs text-muted-foreground">
            ตอนนี้ใช้ q = <span className="font-mono tabular text-foreground">{currentQuantum}</span> → AVG WT{" "}
            <span className="font-mono tabular text-foreground">{format2(current.avgWaitingTime)}</span>
            {current.avgWaitingTime > bestWt && (
              <>
                {" "}
                · ถ้าใช้ q = {bestQs[0]} จะรอลดลง{" "}
                <span className="font-mono tabular text-foreground">
                  {format2(current.avgWaitingTime - bestWt)}
                </span>{" "}
                หน่วยเวลา
              </>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

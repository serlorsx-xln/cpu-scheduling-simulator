"use client";

import { ArrowRight, Check } from "lucide-react";

import { ALGORITHM_META } from "./algorithm-styles";
import { outcomeText, QUEUE_LABEL, selectionReason } from "./queue-copy";
import { useTimeline } from "./timeline-context";
import { useFlip } from "./use-flip";
import { runIntervals } from "@/lib/scheduling/timeline";
import { stateAt, type TraceStep } from "@/lib/scheduling/trace";
import type { SimulationResult } from "@/lib/scheduling/types";
import { cn } from "@/lib/utils";

/** เวลาที่โปรเซสใช้ CPU ไปแล้วก่อนเวลา t */
function usedBefore(result: SimulationResult, id: number, t: number): number {
  return runIntervals(result.gantt, id).reduce(
    (acc, r) => acc + Math.max(0, Math.min(r.end, t) - r.start),
    0
  );
}

/**
 * สถานะ ณ หน่วยเวลาปัจจุบัน: ใครถือ CPU · คิวที่รอตามลำดับ · ใครเสร็จแล้ว
 * ชิปของโปรเซสเลื่อนข้ามช่องได้จริง (FLIP) เมื่อเวลาเดิน — เห็น RR ดันโปรเซสกลับไปท้ายคิว
 */
export default function QueueView({
  result,
  steps,
}: {
  result: SimulationResult
  steps: TraceStep[]
}) {
  const { cursor, focus, setHover, total } = useTimeline();
  const t = cursor ?? 0;
  const { step, running, waiting, done } = stateAt(steps, t);
  const meta = ALGORITHM_META[result.algorithm];
  const burstTimes = result.processes.map((p) => p.burstTime);
  const quantum = result.timeQuantum ?? 0;
  const { containerRef, register } = useFlip<HTMLDivElement>([t, result]);

  // ข้อความเหตุการณ์: ต้นก้าว = ทำไมเลือกตัวนี้, หน่วยสุดท้ายของก้าว = ผลของก้าว
  const isStepStart = step !== null && t === step.start;
  const isStepEnd = step !== null && t === step.end - 1;

  function chip(id: number, variant: "cpu" | "queue" | "done") {
    const bt = burstTimes[id - 1];
    const used = usedBefore(result, id, variant === "cpu" ? t + 1 : t);
    const remaining = bt - used;
    const isFocus = focus === id;
    return (
      <span
        ref={register(`p${id}`)}
        onPointerEnter={() => setHover(id)}
        onPointerLeave={() => setHover(null)}
        className={cn(
          "relative inline-flex h-9 min-w-[3.25rem] flex-col justify-center overflow-hidden rounded-md border px-2.5 transition-colors duration-150",
          variant === "cpu" && "border-transparent text-background",
          variant === "cpu" && meta.fill,
          variant === "queue" && "border-border bg-surface-3 text-foreground",
          variant === "done" && "border-hairline bg-transparent text-muted-foreground",
          // โฟกัสโปรเซส = ยกเป็นสีสว่างแบบเดียวกับ segment บน Gantt
          isFocus && variant !== "cpu" && "border-transparent bg-foreground text-background",
          // ชิป CPU คงสีอัลกอริทึม (data mark) — โฟกัสแสดงเป็นวงแหวนสีสว่างแทน
          isFocus && variant === "cpu" && "ring-2 ring-foreground ring-offset-2 ring-offset-surface-2"
        )}
      >
        <span className="flex items-baseline gap-1.5 text-sm leading-none font-bold">
          P{id}
          {variant === "done" && <Check className="size-3 self-center" aria-hidden />}
        </span>
        <span
          className={cn(
            "mt-1 text-[11px] leading-none",
            variant === "cpu" || isFocus ? "text-background" : "text-muted-foreground"
          )}
        >
          {variant === "done" ? (
            <>
              CT <span className="font-mono tabular">{result.processes[id - 1].completionTime}</span>
            </>
          ) : (
            <>
              เหลือ <span className="font-mono tabular">{remaining}</span>/
              <span className="font-mono tabular">{bt}</span>
            </>
          )}
        </span>
        {/* ความคืบหน้าที่ใช้ CPU ไปแล้ว */}
        {variant !== "done" && (
          <span
            aria-hidden
            className={cn(
              "absolute inset-x-0 bottom-0 h-[2px]",
              variant === "cpu" || isFocus ? "bg-background/25" : "bg-foreground/10"
            )}
          >
            <span
              className={cn(
                "block h-full",
                variant === "cpu" || isFocus ? "bg-background/70" : "bg-foreground/45"
              )}
              style={{ width: `${(used / bt) * 100}%` }}
            />
          </span>
        )}
      </span>
    );
  }

  return (
    <section
      ref={containerRef}
      aria-label={`สถานะคิวของ ${meta.name} ณ เวลา ${t} ถึง ${t + 1}`}
      className="rounded-lg border bg-surface-2 print:hidden"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-hairline px-4 py-2.5">
        <h4 className="text-sm font-bold text-foreground">
          สถานะ ณ เวลา{" "}
          <span className="font-mono tabular">
            {t}–{t + 1}
          </span>
          {cursor === null && <span className="ml-2 font-normal text-muted-foreground">(เริ่มต้น)</span>}
          <span className="ml-3 text-xs font-normal text-muted-foreground">
            เสร็จแล้ว{" "}
            <span className="font-mono tabular text-foreground">
              {done.length}/{result.processes.length}
            </span>
          </span>
        </h4>
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {step &&
            (isStepEnd
              ? outcomeText(step)
              : isStepStart
                ? `เลือก P${step.processId}: ${selectionReason(result.algorithm, step, burstTimes, quantum)}`
                : `P${step.processId} ใช้ CPU ต่อ (ก้าวที่ ${step.index} ช่วง ${step.start}–${step.end})`)}
        </p>
      </div>

      <div className="grid gap-x-6 gap-y-4 px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
        <div>
          <p className="mb-2 text-xs text-muted-foreground">CPU</p>
          <div className="flex min-h-9 items-center">
            {running !== null ? (
              chip(running, "cpu")
            ) : (
              <span className="text-xs text-muted-foreground">ว่าง</span>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-xs text-muted-foreground">{QUEUE_LABEL[result.algorithm]}</p>
          <div className="flex min-h-9 flex-wrap items-center gap-x-1.5 gap-y-2">
            {waiting.length === 0 ? (
              <span className="text-xs text-muted-foreground">ไม่มีใครรอ</span>
            ) : (
              waiting.map((id, i) => (
                <span key={id} className="flex items-center gap-1.5">
                  {i > 0 && <ArrowRight className="size-3 text-muted-foreground" aria-hidden />}
                  {chip(id, "queue")}
                </span>
              ))
            )}
          </div>
        </div>

        {done.length > 0 && (
          <div>
            <p className="mb-2 text-xs text-muted-foreground">เสร็จแล้ว</p>
            <div className="flex min-h-9 flex-wrap items-center gap-1.5">
              {done.map((id) => (
                <span key={id}>{chip(id, "done")}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {cursor === null && total > 0 && (
        <p className="border-t border-hairline px-4 py-2 text-xs text-muted-foreground">
          กด “เล่นการจำลอง” ด้านบน หรือคลิกบน Gantt เพื่อดูคิวในเวลาอื่น
        </p>
      )}
    </section>
  );
}

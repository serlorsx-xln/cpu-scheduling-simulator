import { processBarColor } from "./algorithm-styles";
import type { GanttSegment } from "@/lib/scheduling/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Gantt chart แบบละเอียด:
 * - แท่งสีตาม processId กว้าง ∝ ระยะเวลาที่ได้ CPU (คิดเป็น % ของ makespan)
 * - เส้น grid แนวตั้งทุกช่วงเวลาที่ "หารสวย" + ตัวเลขกำกับแกนเวลา
 * - hover/focus ขยายแท่ง + tooltip บอกช่วงเวลาแบบละเอียด (keyboard เข้าถึงได้)
 * - legend แมปสี ↔ โปรเซส ด้านบน chart
 * - ปิด label ในแท่งเมื่อแคบเกิน แต่ tooltip ยังบอกครบทุก segment
 */
export default function GanttChart({ gantt }: { gantt: GanttSegment[] }) {
  if (gantt.length === 0) return null;
  const total = gantt[gantt.length - 1].end;

  // โปรเซสที่ปรากฏจริงใน chart นี้ (เรียงตาม id) — สำหรับ legend
  const presentIds = [...new Set(gantt.map((s) => s.processId))].sort((a, b) => a - b);

  // เลือกช่วง grid ที่หารสวย ๆ ให้ได้ราว 4–9 เส้น (รองรับ total ใหญ่ด้วย 10× ของ steps)
  const steps = [1, 2, 4, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000];
  const unit = steps.find((s) => total / s <= 9) ?? steps[steps.length - 1];
  const ticks: number[] = [];
  for (let t = unit; t < total; t += unit) ticks.push(t);

  return (
    <figure>
      {/* legend: สี ↔ โปรเซส */}
      <figcaption className="mb-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        {presentIds.map((id) => (
          <span
            key={id}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground"
          >
            <span className={`size-2 rounded-[2px] ${processBarColor(id)}`} aria-hidden />
            P{id}
          </span>
        ))}
        <span className="ml-auto font-mono text-[11px] text-muted-foreground tabular">
          makespan {total}
        </span>
      </figcaption>

      {/* ตัว chart */}
      <div className="relative">
        {/* เส้น grid แนวตั้งพาดผ่านบริเวณแท่ง */}
        <div className="pointer-events-none absolute inset-0 top-0 h-11">
          {ticks.map((t) => (
            <div
              key={t}
              className="absolute top-0 bottom-0 w-px bg-foreground/20"
              style={{ left: `${(t / total) * 100}%` }}
            />
          ))}
        </div>

        {/* แถบแท่ง — คิด width เป็น % ของ makespan แล้ววางต่อเนื่องด้วย margin ติดลบแทน gap
            (gap-px จะทำให้ % รวมเกิน 100 และสเกลเพี้ยน) */}
        <div className="relative flex h-11 w-full">
          {gantt.map((seg, i) => {
            const pct = ((seg.end - seg.start) / total) * 100;
            const showLabel = pct >= 8;
            return (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <div
                    tabIndex={0}
                    role="img"
                    aria-label={`P${seg.processId} ทำงานช่วง ${seg.start} ถึง ${seg.end} หน่วยเวลา`}
                    style={{ width: `${pct}%`, marginLeft: i === 0 ? 0 : "-1px" }}
                    className={`flex min-w-0 cursor-default flex-col items-center justify-center rounded-[4px] text-primary-foreground transition-transform duration-150 hover:scale-y-110 focus-visible:scale-y-110 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring ${processBarColor(seg.processId)}`}
                  >
                    {showLabel && (
                      <>
                        <span className="font-mono text-xs leading-none font-semibold">
                          P{seg.processId}
                        </span>
                        <span className="mt-0.5 font-mono text-[10px] leading-none font-medium opacity-80">
                          {seg.start}–{seg.end}
                        </span>
                      </>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent sideOffset={8}>
                  <p className="font-mono text-xs">
                    P{seg.processId} · ช่วง {seg.start}–{seg.end} · ยาว {seg.end - seg.start} หน่วย
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* แกนเวลา */}
        <div className="relative mt-1 h-4">
          <span className="absolute left-0 font-mono text-[10px] text-muted-foreground tabular">
            0
          </span>
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute -translate-x-1/2 font-mono text-[10px] text-muted-foreground tabular"
              style={{ left: `${(t / total) * 100}%` }}
            >
              {t}
            </span>
          ))}
          <span className="absolute right-0 font-mono text-[10px] text-muted-foreground tabular">
            {total}
          </span>
        </div>
      </div>
    </figure>
  );
}

import { processBarColor } from "./algorithm-styles";
import type { GanttSegment } from "@/lib/scheduling/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Gantt chart แบบละเอียด:
 * - แท่งสีตาม processId กว้าง ∝ ระยะเวลาที่ได้ CPU
 * - แท่งแต่ละอันมี gradient จาง ๆ ตามธรรมชาติของแสง (บนสว่างกว่าล่างเล็กน้อย)
 * - เส้น grid แนวตั้งทุกช่วงเวลาที่"หารสวย" + ตัวเลขกำกับ
 * - hover ขยายแท่ง + tooltip บอกช่วงเวลาแบบละเอียด
 * - แถบแรเงาใต้ chart แสดงสัดส่วนเวลารวมของแต่ละโปรเซส
 */
export default function GanttChart({ gantt }: { gantt: GanttSegment[] }) {
  if (gantt.length === 0) return null;
  const total = gantt[gantt.length - 1].end;

  // เลือกช่วง grid ที่หารสวย ๆ ให้ได้ราว 4–9 เส้น
  const steps = [1, 2, 4, 5, 10, 20, 25, 50, 100];
  const unit = steps.find((s) => total / s <= 9) ?? Math.ceil(total / 9);
  const ticks: number[] = [];
  for (let t = unit; t < total; t += unit) ticks.push(t);

  return (
    <figure className="space-y-1">
      {/* ตัว chart */}
      <div className="relative">
        {/* เส้น grid แนวตั้งพาดผ่านบริเวณแท่ง */}
        <div className="pointer-events-none absolute inset-0 top-0 h-11">
          {ticks.map((t) => (
            <div
              key={t}
              className="absolute top-0 bottom-0 w-px bg-foreground/10"
              style={{ left: `${(t / total) * 100}%` }}
            />
          ))}
        </div>

        <div className="relative flex h-11 w-full gap-px">
          {gantt.map((seg, i) => {
            const pct = ((seg.end - seg.start) / total) * 100;
            const showLabel = pct >= 8;
            return (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <div
                    role="img"
                    aria-label={`P${seg.processId} ทำงานช่วง ${seg.start} ถึง ${seg.end} หน่วยเวลา`}
                    style={{ width: `${pct}%` }}
                    className={`flex min-w-0 cursor-default flex-col items-center justify-center rounded-[4px] text-primary-foreground transition-transform duration-150 hover:scale-y-110 ${processBarColor(seg.processId)}`}
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
                    P{seg.processId} · ช่วง {seg.start}–{seg.end} · ยาว{" "}
                    {seg.end - seg.start} หน่วย
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

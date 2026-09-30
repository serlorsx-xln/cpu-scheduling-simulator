import { processBarColor } from "./algorithm-styles";
import type { GanttSegment } from "@/lib/scheduling/types";

/** Gantt chart: กว้างของแต่ละ segment ∝ ระยะเวลาที่ได้ CPU */
export default function GanttChart({ gantt }: { gantt: GanttSegment[] }) {
  if (gantt.length === 0) return null;
  const total = gantt[gantt.length - 1].end;

  return (
    <div>
      <div className="flex h-16 w-full gap-0.5">
        {gantt.map((seg, i) => {
          const pct = ((seg.end - seg.start) / total) * 100;
          const showLabel = pct >= 9;
          return (
            <div
              key={i}
              style={{ width: `${pct}%` }}
              title={`P${seg.processId}: ${seg.start}–${seg.end}`}
              className={`flex min-w-0 flex-col items-center justify-center rounded-md text-white transition-transform hover:scale-y-105 ${processBarColor(seg.processId)}`}
            >
              {showLabel && (
                <>
                  <span className="text-xs font-bold">P{seg.processId}</span>
                  <span className="text-[10px] leading-tight opacity-90">
                    {seg.start}–{seg.end}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[10px] text-slate-400">
        <span>0</span>
        <span>{total}</span>
      </div>
    </div>
  );
}

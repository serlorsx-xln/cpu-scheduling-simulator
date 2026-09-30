import type { GanttSegment } from "@/lib/scheduling/types";

// ชื่อ class เป็น string ลิตรอลในไฟล์ เพื่อให้ Tailwind JIT เจอและ generate ครบ
const PROCESS_COLORS = [
  "bg-sky-600",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-teal-600",
  "bg-indigo-600",
  "bg-fuchsia-600",
];

function colorOf(processId: number): string {
  return PROCESS_COLORS[(processId - 1) % PROCESS_COLORS.length];
}

/** Gantt chart: กว้างของแต่ละ segment ∝ ระยะเวลาที่ได้ CPU */
export default function GanttChart({ gantt }: { gantt: GanttSegment[] }) {
  if (gantt.length === 0) return null;
  const total = gantt[gantt.length - 1].end;

  return (
    <div>
      <div className="flex h-14 w-full overflow-hidden rounded-lg border border-slate-300">
        {gantt.map((seg, i) => (
          <div
            key={i}
            style={{ width: `${((seg.end - seg.start) / total) * 100}%` }}
            className={`flex min-w-0 flex-col items-center justify-center text-white ${colorOf(seg.processId)} border-r border-white/40 last:border-r-0`}
            title={`P${seg.processId}: ${seg.start}–${seg.end}`}
          >
            <span className="text-xs font-bold">P{seg.processId}</span>
            <span className="text-[10px] whitespace-nowrap">
              {seg.start}–{seg.end}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-slate-500">
        <span>0</span>
        <span>{total}</span>
      </div>
    </div>
  );
}

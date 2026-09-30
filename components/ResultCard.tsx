import { ALGORITHM_META } from "./algorithm-styles";
import GanttChart from "./GanttChart";
import ResultTable from "./ResultTable";
import type { SimulationResult } from "@/lib/scheduling/types";

/** การ์ดผลลัพธ์ 1 อัลกอริทึม: หัวเรื่อง + ตาราง + AVG + Gantt */
export default function ResultCard({
  result,
  index = 0,
}: {
  result: SimulationResult
  index?: number
}) {
  const meta = ALGORITHM_META[result.algorithm];

  return (
    <section
      className="animate-fade-up overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <header className="flex items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className={`size-2.5 rounded-full ${meta.dot}`} />
          <h2 className="text-base font-bold text-slate-900">{meta.label}</h2>
          {result.algorithm === "RR" && (
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-600 ring-1 ring-orange-200">
              q = {result.timeQuantum}
            </span>
          )}
        </div>
        <span className="hidden text-xs text-slate-400 sm:block">{meta.tagline}</span>
      </header>

      <div className="space-y-5 p-5">
        <ResultTable processes={result.processes} />

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              AVG WT
            </p>
            <p className="mt-0.5 font-mono text-2xl font-semibold tabular text-slate-900">
              {result.avgWaitingTime.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              AVG TAT
            </p>
            <p className="mt-0.5 font-mono text-2xl font-semibold tabular text-slate-500">
              {result.avgTurnaroundTime.toFixed(2)}
            </p>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Gantt Chart
          </h3>
          <GanttChart gantt={result.gantt} />
        </div>
      </div>
    </section>
  );
}

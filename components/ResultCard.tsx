import type { SimulationResult } from "@/lib/scheduling/types";
import GanttChart from "./GanttChart";
import ResultTable from "./ResultTable";

const HEADER_STYLES: Record<SimulationResult["algorithm"], string> = {
  FCFS: "bg-blue-600",
  SJF: "bg-emerald-600",
  RR: "bg-orange-600",
};

/** การ์ดผลลัพธ์ 1 อัลกอริทึม: ตาราง + AVG + Gantt */
export default function ResultCard({ result }: { result: SimulationResult }) {
  const title =
    result.algorithm === "RR"
      ? `Round Robin (q = ${result.timeQuantum})`
      : result.algorithm;

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header
        className={`rounded-t-xl px-4 py-3 text-white ${HEADER_STYLES[result.algorithm]}`}
      >
        <h2 className="text-lg font-bold">{title}</h2>
      </header>
      <div className="space-y-4 p-4">
        <ResultTable processes={result.processes} />
        <div className="rounded-lg bg-slate-50 px-4 py-3">
          <span className="text-base font-bold text-slate-800">
            AVG WT = {result.avgWaitingTime.toFixed(2)}
          </span>
          <span className="ml-4 text-sm text-slate-500">
            AVG TAT = {result.avgTurnaroundTime.toFixed(2)}
          </span>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-600">Gantt Chart</h3>
          <GanttChart gantt={result.gantt} />
        </div>
      </div>
    </section>
  );
}

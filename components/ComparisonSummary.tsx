import { ALGORITHM_META } from "./algorithm-styles";
import type { SimulationResult } from "@/lib/scheduling/types";

/** แผงเปรียบเทียบ AVG WT ระหว่างอัลกอริทึม (แสดงเมื่อเลือก ≥ 2 อัลกอริทึม) */
export default function ComparisonSummary({ results }: { results: SimulationResult[] }) {
  if (results.length < 2) return null;

  const avgWts = results.map((r) => r.avgWaitingTime);
  const worst = Math.max(...avgWts);
  const best = Math.min(...avgWts);

  return (
    <section className="animate-fade-up rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-bold text-slate-900">เปรียบเทียบ AVG WT</h2>
        <span className="text-xs text-slate-400">Waiting Time เฉลี่ย — ยิ่งสั้นยิ่งดี</span>
      </div>
      <div className="mt-4 space-y-3.5">
        {results.map((r) => {
          const meta = ALGORITHM_META[r.algorithm];
          const pct = worst === 0 ? 100 : (r.avgWaitingTime / worst) * 100;
          const isBest = r.avgWaitingTime === best;
          return (
            <div key={r.algorithm}>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-slate-600">
                  <span className={`size-2 rounded-full ${meta.dot}`} />
                  {meta.label}
                  {r.algorithm === "RR" && (
                    <span className="text-slate-400">q = {r.timeQuantum}</span>
                  )}
                  {isBest && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      ต่ำสุด
                    </span>
                  )}
                </span>
                <span className="font-mono font-semibold tabular text-slate-800">
                  {r.avgWaitingTime.toFixed(2)}
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-[width] duration-500 ${meta.bar}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

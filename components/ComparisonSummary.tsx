import { ALGORITHM_META } from "./algorithm-styles";
import type { SimulationResult } from "@/lib/scheduling/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** แผงเปรียบเทียบ AVG WT ระหว่างอัลกอริทึม (แสดงเมื่อเลือก ≥ 2 อัลกอริทึม) */
export default function ComparisonSummary({ results }: { results: SimulationResult[] }) {
  if (results.length < 2) return null;

  const avgWts = results.map((r) => r.avgWaitingTime);
  const worst = Math.max(...avgWts);
  const best = Math.min(...avgWts);

  return (
    <section className="animate-fade-up">
      <Card size="sm">
        <CardHeader>
          <CardTitle>เปรียบเทียบ AVG Waiting Time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.map((r) => {
            const meta = ALGORITHM_META[r.algorithm];
            const pct = worst === 0 ? 100 : (r.avgWaitingTime / worst) * 100;
            const isBest = r.avgWaitingTime === best;
            return (
              <div key={r.algorithm}>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2 text-sm">
                    <span className={`size-2 shrink-0 rounded-[3px] ${meta.dot}`} aria-hidden />
                    <span className="font-medium">{meta.fullName}</span>
                    {r.algorithm === "RR" && (
                      <span className="font-mono text-xs text-muted-foreground">
                        (q={r.timeQuantum})
                      </span>
                    )}
                    {isBest && (
                      <Badge
                        variant="outline"
                        className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      >
                        ต่ำสุด
                      </Badge>
                    )}
                  </span>
                  <span className="font-mono text-sm font-semibold tabular">
                    {r.avgWaitingTime.toFixed(2)}
                  </span>
                </div>
                <div
                  className="h-1.5 overflow-hidden rounded-sm bg-muted"
                  role="img"
                  aria-label={`${meta.fullName} AVG WT ${r.avgWaitingTime.toFixed(2)} หน่วยเวลา`}
                >
                  <div
                    className={`h-full rounded-sm ${meta.bar} transition-[width] duration-500 ease-out`}
                    style={{ width: `${pct}%`, opacity: isBest ? 1 : 0.5 }}
                  />
                </div>
              </div>
            );
          })}
          <p className="text-xs text-muted-foreground">
            Waiting Time เฉลี่ยต่อโปรเซส — ค่ายิ่งต่ำยิ่งดี (โปรเซสรอคิวน้อยลง)
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

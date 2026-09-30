import { ALGORITHM_META } from "./algorithm-styles";
import GanttChart from "./GanttChart";
import ResultTable from "./ResultTable";
import type { SimulationResult } from "@/lib/scheduling/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      className="animate-fade-up"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5">
            <span className={`size-2.5 rounded-[3px] ${meta.dot}`} aria-hidden />
            {meta.fullName}
            {result.algorithm === "RR" && (
              <Badge variant="outline" className="font-mono font-normal">
                q = {result.timeQuantum}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>{meta.tagline}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <ResultTable processes={result.processes} />

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/60 px-4 py-3">
              <p className="text-xs text-muted-foreground">AVG Waiting Time</p>
              <p className="mt-0.5 font-mono text-2xl font-semibold tabular text-foreground">
                {result.avgWaitingTime.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg bg-muted/60 px-4 py-3">
              <p className="text-xs text-muted-foreground">AVG Turnaround Time</p>
              <p className="mt-0.5 font-mono text-2xl font-semibold tabular text-foreground/70">
                {result.avgTurnaroundTime.toFixed(2)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-2.5 text-xs font-medium text-muted-foreground">
              Gantt Chart
            </h3>
            <GanttChart gantt={result.gantt} />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

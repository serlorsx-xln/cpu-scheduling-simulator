"use client";

import { useMemo } from "react";

import { ALGORITHM_META } from "./algorithm-styles";
import QueueView from "./QueueView";
import StepTrace from "./StepTrace";
import ResultTable from "./ResultTable";
import ScheduleTimeline from "./ScheduleTimeline";
import { traceSchedule } from "@/lib/scheduling/trace";
import type { SimulationResult } from "@/lib/scheduling/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** การ์ดผลลัพธ์ 1 อัลกอริทึม: หัว (ชื่อ กฎ ค่าเฉลี่ย) → Gantt + แถวราย process → ตารางตามโจทย์ */
export default function ResultCard({
  result,
  index = 0,
  isBest = false,
}: {
  result: SimulationResult
  index?: number
  /** มีเวลารอเฉลี่ยต่ำสุดในรอบนี้ (แสดงเมื่อเทียบ ≥ 2 อัลกอริทึม) */
  isBest?: boolean
}) {
  const meta = ALGORITHM_META[result.algorithm];
  const steps = useMemo(
    () =>
      traceSchedule(
        result.algorithm,
        result.processes.map((p) => p.burstTime),
        result.timeQuantum ?? 1
      ),
    [result]
  );
  const headingId = `result-${result.algorithm}`;

  return (
    <section
      aria-labelledby={headingId}
      className="animate-rise scroll-mt-20"
      style={{ animationDelay: `${index * 60}ms` }}
      id={`algo-${result.algorithm}`}
    >
      <Card className="gap-0 py-0 print:break-inside-avoid-page">
        <CardHeader className="gap-0 border-b px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className={cn("size-2.5 shrink-0 rounded-[3px]", meta.fill)} aria-hidden />
                <h3 id={headingId} className="text-base font-bold text-foreground">
                  {meta.name}
                </h3>
                <span className="text-xs text-subtle">{meta.short}</span>
                {result.algorithm === "RR" && (
                  <Badge variant="outline" className="font-normal text-muted-foreground">
                    q = {result.timeQuantum}
                  </Badge>
                )}
              </div>
              <p className="mt-1.5 pl-5 text-sm text-muted-foreground">{meta.rule}</p>
            </div>

            <dl className="flex items-end gap-6 pl-5 sm:pl-0">
              <div>
                <dt className="text-xs text-muted-foreground">AVG TAT</dt>
                <dd className="mt-0.5 text-lg leading-none font-bold text-muted-foreground">
                  {result.avgTurnaroundTime.toFixed(2)}
                </dd>
              </div>
              <div className="text-right">
                <dt className="text-xs text-muted-foreground">AVG WT</dt>
                <dd className="mt-0.5 flex items-baseline justify-end gap-2 text-[1.75rem] leading-none font-bold text-foreground">
                  {result.avgWaitingTime.toFixed(2)}
                </dd>
                {isBest && (
                  <p className="mt-1.5 text-xs text-foreground">รอเฉลี่ยน้อยที่สุด</p>
                )}
              </div>
            </dl>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-5 py-5 sm:px-6">
          <ScheduleTimeline result={result} />
          <QueueView result={result} steps={steps} />
          <ResultTable
            processes={result.processes}
            avgWaitingTime={result.avgWaitingTime}
            avgTurnaroundTime={result.avgTurnaroundTime}
          />
          <StepTrace result={result} steps={steps} />
        </CardContent>
      </Card>
    </section>
  );
}

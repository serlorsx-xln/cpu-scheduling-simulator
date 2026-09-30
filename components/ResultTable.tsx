"use client";

import type React from "react";

import { useTimeline } from "./timeline-context";
import type { ProcessResult } from "@/lib/scheduling/types";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const COLUMNS: { key: string; label: string; hint: string }[] = [
  { key: "bt", label: "BT", hint: "Burst Time — เวลาที่ต้องใช้ CPU" },
  { key: "st", label: "ST", hint: "Start Time — เวลาที่ได้ CPU ครั้งแรก" },
  { key: "ct", label: "CT", hint: "Completion Time — เวลาที่ทำงานเสร็จ" },
  { key: "tat", label: "TAT", hint: "Turnaround Time = CT − AT (AT = 0)" },
  { key: "wt", label: "WT", hint: "Waiting Time = TAT − BT" },
];

const format2 = (n: number) => n.toFixed(2);

/** ตัวเลขในสูตร — mono เฉพาะตัวเลข ตัวดำเนินการใช้ฟอนต์ข้อความ */
function Num({ children, strong }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <span className={cn("font-mono tabular", strong ? "font-semibold text-foreground" : "text-foreground/85")}>
      {children}
    </span>
  );
}

/** ตาราง Process | BT | ST | CT | TAT | WT ตามโจทย์ — เรียง P1…Pn เสมอ แถวสรุปแสดงสูตรเฉลี่ย */
export default function ResultTable({
  processes,
  avgWaitingTime,
  avgTurnaroundTime,
}: {
  processes: ProcessResult[]
  avgWaitingTime: number
  avgTurnaroundTime: number
}) {
  const { focus, setHover, togglePin, pinned } = useTimeline();
  const n = processes.length;
  const sumWt = processes.reduce((a, p) => a + p.waitingTime, 0);
  const sumTat = processes.reduce((a, p) => a + p.turnaroundTime, 0);

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table className="text-[13px] sm:text-sm">
        <TableHeader className="bg-surface-2">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-9 pl-3 text-xs font-bold text-muted-foreground sm:pl-4">
              Process
            </TableHead>
            {COLUMNS.map((c) => (
              <TableHead key={c.key} className="h-9 px-1.5 text-right text-xs last:pr-3 sm:px-2 sm:last:pr-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      tabIndex={0}
                      className={cn(
                        "cursor-help font-bold underline decoration-subtle/50 decoration-dotted underline-offset-4 outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring/50",
                        c.key === "wt" ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {c.label}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{c.hint}</TooltipContent>
                </Tooltip>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="font-mono tabular">
          {processes.map((p) => {
            const isFocus = focus === p.id;
            return (
              <TableRow
                key={p.id}
                onPointerEnter={() => setHover(p.id)}
                onPointerLeave={() => setHover(null)}
                onClick={() => togglePin(p.id)}
                data-state={pinned === p.id ? "selected" : undefined}
                className={cn(
                  "cursor-pointer transition-colors duration-150",
                  isFocus ? "bg-accent hover:bg-accent" : "hover:bg-surface-2"
                )}
              >
                <TableCell className="py-2 pl-3 font-sans font-bold text-foreground sm:pl-4">
                  P{p.id}
                </TableCell>
                <TableCell className="py-2 text-right text-muted-foreground px-1.5 sm:px-2">{p.burstTime}</TableCell>
                <TableCell className="py-2 text-right text-muted-foreground px-1.5 sm:px-2">{p.startTime}</TableCell>
                <TableCell className="py-2 text-right text-foreground px-1.5 sm:px-2">{p.completionTime}</TableCell>
                <TableCell className="py-2 text-right text-muted-foreground px-1.5 sm:px-2">
                  {p.turnaroundTime}
                </TableCell>
                <TableCell className="py-2 pr-3 pl-1.5 text-right font-semibold text-foreground sm:pr-4 sm:pl-2">
                  {p.waitingTime}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter className="border-t bg-surface-2/60 font-mono tabular">
          <TableRow className="hover:bg-transparent">
            <TableCell className="py-2.5 pl-3 font-sans text-xs font-bold text-muted-foreground sm:pl-4">
              เฉลี่ย
            </TableCell>
            <TableCell colSpan={3} />
            <TableCell className="px-1.5 py-2.5 text-right text-muted-foreground sm:px-2">
              {format2(avgTurnaroundTime)}
            </TableCell>
            <TableCell className="py-2.5 pr-3 pl-1.5 text-right font-semibold text-foreground sm:pr-4 sm:pl-2">
              {format2(avgWaitingTime)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <p className="flex flex-wrap gap-x-4 gap-y-1 border-t bg-surface-2/60 px-3 py-2.5 text-xs text-muted-foreground sm:px-4">
        <span>
          AVG WT = ΣWT ÷ n = <Num>{sumWt}</Num> ÷ <Num>{n}</Num> ={" "}
          <Num strong>{format2(avgWaitingTime)}</Num>
        </span>
        <span>
          AVG TAT = <Num>{sumTat}</Num> ÷ <Num>{n}</Num> ={" "}
          <Num>{format2(avgTurnaroundTime)}</Num>
        </span>
      </p>
    </div>
  );
}

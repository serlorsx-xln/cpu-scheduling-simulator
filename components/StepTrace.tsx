"use client";

import { ChevronDown, Play } from "lucide-react";
import { useState } from "react";

import { selectionReason } from "./queue-copy";
import { useTimeline } from "./timeline-context";
import type { TraceStep } from "@/lib/scheduling/trace";
import type { SimulationResult } from "@/lib/scheduling/types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const queueText = (ids: number[]) => (ids.length === 0 ? "—" : ids.map((id) => `P${id}`).join(" "));

/**
 * "วิธีคิดทีละขั้น" — ตารางเดียวกับการคำนวณมือ (docs/07): ก้าว · เวลา · คิวก่อนเลือก · เลือก · เหตุผล · เหลือ · ผล
 * แถวของก้าวที่ตรงกับเวลาปัจจุบันถูกไฮไลต์ คลิกแถวเพื่อเลื่อนเวลาทุกกราฟไปที่ก้าวนั้น
 */
export default function StepTrace({
  result,
  steps,
}: {
  result: SimulationResult
  steps: TraceStep[]
}) {
  const [open, setOpen] = useState(false);
  const { cursor, setHeld, pause, focus, setHover } = useTimeline();
  const burstTimes = result.processes.map((p) => p.burstTime);
  const quantum = result.timeQuantum ?? 0;
  const contentId = `steps-${result.algorithm}`;

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-lg border">
      <CollapsibleTrigger
        aria-controls={contentId}
        className="flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left transition-colors outline-none hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <span>
          <span className="block text-sm font-bold text-foreground">วิธีคิดทีละขั้น</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            <span className="font-mono tabular">{steps.length}</span> ก้าว · ตารางแบบเดียวกับการคำนวณมือ
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200 print:hidden",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </CollapsibleTrigger>

      {/* forceMount + ซ่อนด้วย CSS: ตอนพิมพ์กางเสมอโดยไม่ต้องรอ event ของเบราว์เซอร์ */}
      <CollapsibleContent
        forceMount
        id={contentId}
        className="border-t data-[state=closed]:hidden print:block!"
      >
        <Table className="text-[13px]">
          <TableHeader className="bg-surface-2">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-9 w-10 pl-4 text-xs font-bold text-muted-foreground">ก้าว</TableHead>
              <TableHead className="h-9 text-xs font-bold text-muted-foreground">เวลา</TableHead>
              <TableHead className="h-9 text-xs font-bold text-muted-foreground">คิวก่อนเลือก</TableHead>
              <TableHead className="h-9 text-xs font-bold text-muted-foreground">เลือก · เหตุผล</TableHead>
              <TableHead className="h-9 text-right text-xs font-bold text-muted-foreground">เหลือ</TableHead>
              <TableHead className="h-9 pr-4 text-xs font-bold text-muted-foreground">ผล</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {steps.map((s) => {
              const active = cursor !== null && cursor >= s.start && cursor < s.end;
              const isFocus = focus === s.processId;
              return (
                <TableRow
                  key={s.index}
                  tabIndex={0}
                  aria-current={active ? "step" : undefined}
                  onClick={() => {
                    pause();
                    setHeld(s.start);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      pause();
                      setHeld(s.start);
                    }
                  }}
                  onPointerEnter={() => setHover(s.processId)}
                  onPointerLeave={() => setHover(null)}
                  className={cn(
                    "cursor-pointer align-top transition-colors duration-150 outline-none focus-visible:bg-surface-2",
                    isFocus ? "bg-accent hover:bg-accent" : active ? "bg-surface-2" : "hover:bg-surface-2"
                  )}
                >
                  <TableCell className="py-2 pl-4 font-mono tabular text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      {/* เครื่องหมายก้าวของเวลาปัจจุบัน (สถานะเวลา แยกจากการโฟกัสโปรเซส) */}
                      <Play
                        className={cn("size-2.5 fill-current", active ? "text-foreground" : "invisible")}
                        aria-hidden
                      />
                      <span className={cn(active && "text-foreground")}>{s.index}</span>
                    </span>
                  </TableCell>
                  <TableCell className="py-2 font-mono whitespace-nowrap tabular text-foreground">
                    {s.start}–{s.end}
                  </TableCell>
                  <TableCell className="py-2 whitespace-nowrap text-muted-foreground">
                    {queueText(s.ready)}
                  </TableCell>
                  <TableCell className="min-w-[14rem] py-2 whitespace-normal">
                    <span className="font-bold text-foreground">P{s.processId}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      · {selectionReason(result.algorithm, s, burstTimes, quantum)}
                    </span>
                  </TableCell>
                  <TableCell className="py-2 text-right font-mono whitespace-nowrap tabular text-muted-foreground">
                    {s.remainingBefore} → <span className="text-foreground">{s.remainingAfter}</span>
                  </TableCell>
                  <TableCell className="py-2 pr-4 whitespace-nowrap">
                    {s.outcome === "complete" ? (
                      <span className="text-foreground">
                        เสร็จ · CT <span className="font-mono tabular">{s.end}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        กลับท้ายคิว → {queueText(s.queueAfter)}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CollapsibleContent>
    </Collapsible>
  );
}

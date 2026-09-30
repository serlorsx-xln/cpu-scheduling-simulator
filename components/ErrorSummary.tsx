"use client";

import { AlertTriangle, ArrowUpRight } from "lucide-react";

import type { ValidationIssue } from "@/lib/validation";

/** id ของช่องที่ต้องแก้ ตาม field ของ issue — ใช้ย้ายโฟกัสไปแก้ได้ทันที */
function targetId(issue: ValidationIssue, firstEmptyBt: number): string {
  switch (issue.field) {
    case "processCount":
      return "process-count";
    case "burstTime":
      return `bt-${issue.processId ?? firstEmptyBt}`;
    case "timeQuantum":
      return "time-quantum";
    case "algorithm":
      return "algorithm-fcfs";
  }
}

/**
 * กล่องรวมข้อผิดพลาด (role="alert") แสดงเหนือผลลัพธ์ — ไม่ใช้ alert()
 * แต่ละข้อเป็นปุ่มพาไปยังช่องที่ผิด
 */
export default function ErrorSummary({
  issues,
  firstEmptyBt,
}: {
  issues: ValidationIssue[]
  /** P ของแถว BT แรกที่ว่าง — ใช้เป็นเป้าหมายของ E5 ที่ไม่ระบุแถว */
  firstEmptyBt: number
}) {
  if (issues.length === 0) return null;

  function focusField(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus({ preventScroll: true });
  }

  return (
    <div
      role="alert"
      className="animate-rise rounded-xl border border-destructive/35 bg-destructive/[0.06] px-5 py-4"
    >
      <p className="flex items-center gap-2 text-sm font-bold text-destructive">
        <AlertTriangle className="size-4 shrink-0" aria-hidden />
        ยังคำนวณไม่ได้ — พบ {issues.length} จุดที่ต้องแก้
      </p>
      <ul className="mt-3 space-y-1">
        {issues.map((issue, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => focusField(targetId(issue, firstEmptyBt))}
              className="group inline-flex items-center gap-1.5 rounded-sm text-left text-sm text-foreground/90 underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {issue.message}
              <ArrowUpRight
                className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-px group-hover:-translate-y-px"
                aria-hidden
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

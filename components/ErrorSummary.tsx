import { AlertTriangle } from "lucide-react";

import type { ValidationIssue } from "@/lib/validation";

/** กล่องรวมข้อความ error จาก validation — แสดงเหนือผลลัพธ์ */
export default function ErrorSummary({ issues }: { issues: ValidationIssue[] }) {
  if (issues.length === 0) return null;

  return (
    <div
      role="alert"
      className="animate-fade-up rounded-xl border border-destructive/30 bg-destructive/10 p-4"
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
        <AlertTriangle className="size-4 shrink-0" aria-hidden />
        พบข้อผิดพลาด {issues.length} รายการ — กรุณาแก้ไขก่อนคำนวณ
      </p>
      <ul className="mt-2.5 space-y-1 pl-6 text-sm text-destructive/90">
        {issues.map((issue, i) => (
          <li key={i} className="list-disc">
            {issue.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

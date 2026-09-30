import type { ValidationIssue } from "@/lib/validation";

/** กล่องรวมข้อความ error จาก validation — แสดงเหนือผลลัพธ์ */
export default function ErrorSummary({ issues }: { issues: ValidationIssue[] }) {
  if (issues.length === 0) return null;

  return (
    <div
      role="alert"
      className="animate-fade-up rounded-2xl border border-red-200 bg-red-50/80 p-4"
    >
      <p className="text-sm font-bold text-red-700">⚠ พบข้อผิดพลาด กรุณาแก้ไขก่อนคำนวณ</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-600">
        {issues.map((issue, i) => (
          <li key={i}>{issue.message}</li>
        ))}
      </ul>
    </div>
  );
}

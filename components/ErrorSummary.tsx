import type { ValidationIssue } from "@/lib/validation";

/** กล่องรวมข้อความ error จาก validation — แสดงเหนือผลลัพธ์ */
export default function ErrorSummary({ issues }: { issues: ValidationIssue[] }) {
  if (issues.length === 0) return null;

  return (
    <div
      role="alert"
      className="rounded-xl border border-red-400 bg-red-50 p-4 text-red-700"
    >
      <p className="mb-2 font-bold">⚠ พบข้อผิดพลาด</p>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {issues.map((issue, i) => (
          <li key={i}>{issue.message}</li>
        ))}
      </ul>
    </div>
  );
}

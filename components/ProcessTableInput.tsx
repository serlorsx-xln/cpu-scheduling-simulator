"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ProcessTableInputProps {
  burstTimes: string[]
  /** โหมดสุ่ม: ช่อง readonly แต่ยังแสดงค่าที่ใช้คำนวณจริง */
  readOnly: boolean
  onChange: (index: number, value: string) => void
  /** ข้อความ error ของแถว (ถ้ามี) → ขอบแดง + ข้อความใต้ช่อง */
  errorFor: (processId: number) => string | undefined
}

/** ค่าเป็นจำนวนเต็มบวกไหม (ใช้แค่วาดแถบ — การตรวจจริงอยู่ที่ lib/validation.ts) */
function asPositiveInt(raw: string): number | null {
  const v = Number(raw.trim());
  return raw.trim() !== "" && Number.isInteger(v) && v >= 1 ? v : null;
}

/**
 * ช่องกรอก Burst Time ของ P1…Pn — ทุกแถวมีแถบสัดส่วน BT ให้เห็นงานสั้น/ยาวก่อนคำนวณ
 * ≥ 6 โปรเซสจัดเป็น 2 คอลัมน์เพื่อไม่ให้แผงยาวเกินจอ
 */
export default function ProcessTableInput({
  burstTimes,
  readOnly,
  onChange,
  errorFor,
}: ProcessTableInputProps) {
  const values = burstTimes.map(asPositiveInt);
  const scaleMax = Math.max(10, ...values.map((v) => v ?? 0));
  const allValid = values.length > 0 && values.every((v) => v !== null);
  const total = values.reduce<number>((a, v) => a + (v ?? 0), 0);

  return (
    <div>
      <ul
        className={cn(
          "grid gap-x-5 gap-y-1",
          burstTimes.length >= 6 ? "grid-cols-2" : "grid-cols-1"
        )}
      >
        {burstTimes.map((bt, index) => {
          const id = index + 1;
          const error = errorFor(id);
          const v = values[index];
          return (
            <li key={index} className="min-w-0">
              <div className="flex items-center gap-2.5">
                <label
                  htmlFor={`bt-${id}`}
                  className={cn(
                    "w-7 shrink-0 text-xs",
                    error ? "text-destructive" : "text-muted-foreground"
                  )}
                >
                  P{id}
                </label>
                <Input
                  id={`bt-${id}`}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={bt}
                  readOnly={readOnly}
                  aria-label={`P${id} Burst Time`}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `bt-${id}-error` : undefined}
                  onChange={(e) => onChange(index, e.target.value)}
                  className={cn(
                    "h-8 w-14 shrink-0 px-2 text-right font-mono tabular",
                    readOnly &&
                      "cursor-default border-transparent bg-surface-2 text-foreground focus-visible:border-transparent dark:bg-surface-2"
                  )}
                />
                <span className="relative h-1.5 min-w-6 flex-1 rounded-r-[3px]" aria-hidden>
                  <span
                    className="absolute inset-y-0 left-0 rounded-r-[3px] bg-foreground/35 transition-[width] duration-200"
                    style={{ width: v === null ? 0 : `${(v / scaleMax) * 100}%` }}
                  />
                </span>
              </div>
              {error && (
                <p id={`bt-${id}-error`} className="mt-1 mb-1 pl-9.5 text-xs text-destructive">
                  {error}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>หน่วย: หน่วยเวลา · Arrival Time = 0 ทุกโปรเซส</span>
        {allValid && (
          <span>
            ΣBT <span className="font-mono tabular text-foreground">{total}</span>
          </span>
        )}
      </p>
    </div>
  );
}

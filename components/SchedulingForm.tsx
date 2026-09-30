"use client";

import { Dices, Minus, Plus, RotateCcw } from "lucide-react";

import ProcessTableInput from "./ProcessTableInput";
import { ALGORITHM_META } from "./algorithm-styles";
import type { AlgorithmName } from "@/lib/scheduling/types";
import type { RawFormInput } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type BtMode = "random" | "manual";
export type AlgorithmFlags = RawFormInput["algorithms"];

interface SchedulingFormProps {
  processCount: number | ""
  onProcessCountChange: (value: number | "") => void
  btMode: BtMode
  onBtModeChange: (mode: BtMode) => void
  burstTimes: string[]
  onBurstTimeChange: (index: number, value: string) => void
  onReshuffle: () => void
  algorithms: AlgorithmFlags
  onAlgorithmToggle: (key: keyof AlgorithmFlags, checked: boolean) => void
  timeQuantum: string
  onTimeQuantumChange: (value: string) => void
  onReset: () => void
  onSubmit: () => void
  processCountError?: string
  burstTimeError: (processId: number) => string | undefined
  timeQuantumError?: string
}

const ALGORITHM_ORDER: { key: keyof AlgorithmFlags; name: AlgorithmName }[] = [
  { key: "fcfs", name: "FCFS" },
  { key: "sjf", name: "SJF" },
  { key: "rr", name: "RR" },
];

function StepHeading({ no, title }: { no: string; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="flex size-5 items-center justify-center rounded-[5px] bg-secondary font-mono text-[11px] font-medium text-secondary-foreground">
        {no}
      </span>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    </div>
  );
}

/** แผงตั้งค่าการจำลอง (คอลัมน์ซ้าย sticky บนจอใหญ่) */
export default function SchedulingForm(props: SchedulingFormProps) {
  const { algorithms } = props;

  const adjustQuantum = (delta: number) => {
    const current = Number.parseInt(props.timeQuantum, 10);
    const next = Number.isNaN(current) ? 1 : Math.max(1, current + delta);
    props.onTimeQuantumChange(String(next));
  };

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit();
      }}
      aria-label="ฟอร์มตั้งค่าการจำลอง"
    >
      <Card>
        <CardContent className="space-y-6">
          {/* 01 — จำนวนโปรเซส */}
          <section>
            <StepHeading no="1" title="จำนวนโปรเซส" />
            <div className="flex items-center gap-2.5">
              <div className="space-y-1.5">
                <Label htmlFor="process-count" className="sr-only">
                  จำนวนโปรเซส (1–10)
                </Label>
                <Input
                  id="process-count"
                  type="number"
                  min={1}
                  max={10}
                  aria-label="จำนวนโปรเซส (1–10)"
                  value={props.processCount}
                  onChange={(e) =>
                    props.onProcessCountChange(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  aria-invalid={Boolean(props.processCountError)}
                  className="w-20 text-center font-mono tabular text-base font-semibold"
                />
              </div>
              <div className="flex gap-1.5 pt-0.5">
                {[3, 5, 10].map((n) => (
                  <Button
                    key={n}
                    type="button"
                    variant={props.processCount === n ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => props.onProcessCountChange(n)}
                    className="font-mono"
                  >
                    {n}
                  </Button>
                ))}
              </div>
            </div>
            {props.processCountError ? (
              <p className="mt-2 text-xs text-destructive">{props.processCountError}</p>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">
                ระบบสร้างแถว P1–P{n_display(props.processCount)} ให้อัตโนมัติ
              </p>
            )}
          </section>

          <Separator />

          {/* 02 — Burst Time */}
          <section>
            <StepHeading no="2" title="Burst Time" />
            <div className="mb-3 inline-flex rounded-lg bg-muted p-1">
              {(
                [
                  ["random", "สุ่มอัตโนมัติ"],
                  ["manual", "กรอกเอง"],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => props.onBtModeChange(mode)}
                  aria-pressed={props.btMode === mode}
                  className={cn(
                    "rounded-md px-3.5 py-1.5 text-sm transition-colors",
                    props.btMode === mode
                      ? "bg-background font-medium text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
              {props.btMode === "random" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={props.onReshuffle}
                  className="ml-1 gap-1.5"
                  title="สุ่มค่า Burst Time ใหม่"
                >
                  <Dices className="size-3.5" aria-hidden />
                  สุ่มใหม่
                </Button>
              )}
            </div>
            <ProcessTableInput
              burstTimes={props.burstTimes}
              readOnly={props.btMode === "random"}
              onChange={props.onBurstTimeChange}
              errorFor={props.burstTimeError}
            />
          </section>

          <Separator />

          {/* 03 — อัลกอริทึม */}
          <section>
            <StepHeading no="3" title="อัลกอริทึมที่ต้องการเปรียบเทียบ" />
            <div className="space-y-2">
              {ALGORITHM_ORDER.map(({ key, name }) => {
                const meta = ALGORITHM_META[name];
                const checked = algorithms[key];
                const inputId = `algorithm-${key}`;
                return (
                  <div key={key}>
                    <input
                      id={inputId}
                      type="checkbox"
                      className="peer sr-only"
                      checked={checked}
                      onChange={(e) => props.onAlgorithmToggle(key, e.target.checked)}
                    />
                    <label
                      htmlFor={inputId}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                        "peer-focus-visible:ring-2 peer-focus-visible:ring-ring/50 peer-focus-visible:outline-none",
                        checked
                          ? `${meta.softBg} ${meta.border}`
                          : "border-border hover:bg-secondary/50"
                      )}
                    >
                      <span
                        className={cn(
                          "size-2.5 shrink-0 rounded-[3px] transition-opacity",
                          meta.dot,
                          checked ? "opacity-100" : "opacity-25"
                        )}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-foreground">
                          {meta.fullName}
                          <span className="ml-1.5 font-mono text-xs text-muted-foreground">
                            {meta.label}
                          </span>
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {meta.tagline}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "font-mono text-xs",
                          checked ? meta.text : "text-muted-foreground/40"
                        )}
                      >
                        {checked ? "✓" : "+"}
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>

            {algorithms.rr && (
              <div className="mt-3 rounded-lg border bg-muted/40 p-3">
                <Label
                  htmlFor="time-quantum"
                  className="text-xs text-muted-foreground"
                >
                  Time Quantum
                </Label>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="inline-flex items-center overflow-hidden rounded-lg border bg-background">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => adjustQuantum(-1)}
                      aria-label="ลด Time Quantum"
                      className="rounded-none border-r"
                    >
                      <Minus className="size-3.5" aria-hidden />
                    </Button>
                    <Input
                      id="time-quantum"
                      type="number"
                      min={1}
                      value={props.timeQuantum}
                      onChange={(e) => props.onTimeQuantumChange(e.target.value)}
                      aria-invalid={Boolean(props.timeQuantumError)}
                      className="w-14 rounded-none border-0 text-center font-mono tabular font-semibold focus-visible:ring-0"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => adjustQuantum(1)}
                      aria-label="เพิ่ม Time Quantum"
                      className="rounded-none border-l"
                    >
                      <Plus className="size-3.5" aria-hidden />
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    จำนวนหน่วยเวลาต่อรอบของแต่ละโปรเซส
                  </span>
                </div>
                {props.timeQuantumError && (
                  <p className="mt-2 text-xs text-destructive">{props.timeQuantumError}</p>
                )}
              </div>
            )}
          </section>

          <Separator />

          {/* actions */}
          <section className="space-y-2">
            <Button type="submit" className="w-full">
              คำนวณผลลัพธ์
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={props.onReset}
              className="w-full gap-1.5"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              ล้างค่า
            </Button>
          </section>
        </CardContent>
      </Card>
    </form>
  );
}

/** แสดง n ปลอดภัยเมื่อยังไม่กรอก */
function n_display(n: number | ""): string {
  return n === "" ? "n" : String(n);
}

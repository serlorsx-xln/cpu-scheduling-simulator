"use client";

import { Dices, Minus, Plus, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";

import ProcessTableInput from "./ProcessTableInput";
import { ALGORITHM_META, ALGORITHM_ORDER } from "./algorithm-styles";
import type { RawFormInput } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type BtMode = "random" | "manual";
export type AlgorithmFlags = RawFormInput["algorithms"];

const KEY_OF = { FCFS: "fcfs", SJF: "sjf", RR: "rr" } as const;

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
  algorithmError?: string
}

function Section({
  title,
  hint,
  action,
  children,
}: {
  title: string
  hint?: ReactNode
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="px-5 py-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        {action}
      </div>
      {children}
      {hint}
    </section>
  );
}

/** ช่องตัวเลข + ปุ่ม −/+ (ขั้นต่ำ 1) ใช้กับจำนวนโปรเซสและ Time Quantum */
function NumberStepper({
  id,
  value,
  onChange,
  min = 1,
  max,
  invalid,
  describedBy,
  label,
}: {
  id: string
  value: string
  onChange: (next: string) => void
  min?: number
  max?: number
  invalid?: boolean
  describedBy?: string
  label: string
}) {
  const step = (delta: number) => {
    const current = Number.parseInt(value, 10);
    let next = Number.isNaN(current) ? min : current + delta;
    next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    onChange(String(next));
  };
  const current = Number.parseInt(value, 10);

  return (
    <div
      className={cn(
        "inline-flex h-8 items-stretch overflow-hidden rounded-lg border border-input bg-input/30 transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        invalid && "border-destructive/60 ring-3 ring-destructive/25"
      )}
    >
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={!Number.isNaN(current) && current <= min}
        aria-label={`ลด${label}`}
        className="grid w-8 place-items-center text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:bg-accent disabled:pointer-events-none disabled:opacity-40"
      >
        <Minus className="size-3.5" aria-hidden />
      </button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className="w-11 border-x border-input bg-transparent text-center font-mono text-sm font-medium tabular text-foreground outline-none"
      />
      <button
        type="button"
        onClick={() => step(1)}
        disabled={max !== undefined && !Number.isNaN(current) && current >= max}
        aria-label={`เพิ่ม${label}`}
        className="grid w-8 place-items-center text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:bg-accent disabled:pointer-events-none disabled:opacity-40"
      >
        <Plus className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}

/** แผงตั้งค่าการจำลอง — คอลัมน์ซ้าย (sticky บนจอใหญ่) */
export default function SchedulingForm(props: SchedulingFormProps) {
  const { algorithms } = props;
  const countValue = props.processCount === "" ? "" : String(props.processCount);

  return (
    <form
      className="lg:flex lg:max-h-full lg:min-h-0 lg:flex-col"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit();
      }}
      aria-label="ตั้งค่าการจำลอง"
    >
      <Card className="gap-0 py-0 lg:min-h-0 lg:flex-1">
        <CardContent className="divide-y divide-border px-0 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain">
          {/* จำนวนโปรเซส */}
          <Section
            title="จำนวนโปรเซส"
            hint={
              props.processCountError ? (
                <p id="process-count-error" className="mt-2 text-xs text-destructive">
                  {props.processCountError}
                </p>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  สร้าง P1–P{props.processCount === "" ? "n" : props.processCount} ให้อัตโนมัติ ·
                  สูงสุด 10
                </p>
              )
            }
          >
            <div className="flex flex-wrap items-center gap-3">
              <NumberStepper
                id="process-count"
                label="จำนวนโปรเซส (1–10)"
                value={countValue}
                max={10}
                invalid={Boolean(props.processCountError)}
                describedBy={props.processCountError ? "process-count-error" : undefined}
                onChange={(next) =>
                  props.onProcessCountChange(next === "" ? "" : Number(next))
                }
              />
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                spacing={0}
                value={[3, 5, 10].includes(Number(countValue)) ? countValue : ""}
                onValueChange={(v) => v && props.onProcessCountChange(Number(v))}
                aria-label="จำนวนโปรเซสสำเร็จรูป"
              >
                {["3", "5", "10"].map((n) => (
                  <ToggleGroupItem key={n} value={n} className="w-9 font-mono text-xs">
                    {n}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </Section>

          {/* Burst Time */}
          <Section
            title="Burst Time"
            action={
              props.btMode === "random" ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={props.onReshuffle}
                      className="-my-1 text-muted-foreground"
                    >
                      <Dices aria-hidden />
                      สุ่มใหม่
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>สุ่มจำนวนเต็ม 1–10 ให้ทุกโปรเซสใหม่</TooltipContent>
                </Tooltip>
              ) : null
            }
          >
            <Tabs
              value={props.btMode}
              onValueChange={(v) => props.onBtModeChange(v as BtMode)}
              className="mb-4"
            >
              <TabsList className="w-full">
                <TabsTrigger value="random">สุ่มอัตโนมัติ</TabsTrigger>
                <TabsTrigger value="manual">กรอกเอง</TabsTrigger>
              </TabsList>
            </Tabs>
            <ProcessTableInput
              burstTimes={props.burstTimes}
              readOnly={props.btMode === "random"}
              onChange={props.onBurstTimeChange}
              errorFor={props.burstTimeError}
            />
          </Section>

          {/* อัลกอริทึม */}
          <Section
            title="อัลกอริทึม"
            action={<span className="text-xs text-muted-foreground">เลือกได้หลายแบบ</span>}
            hint={
              props.algorithmError ? (
                <p className="mt-2 text-xs text-destructive">{props.algorithmError}</p>
              ) : null
            }
          >
            <div className="space-y-2">
              {ALGORITHM_ORDER.map((name) => {
                const key = KEY_OF[name];
                const meta = ALGORITHM_META[name];
                const checked = algorithms[key];
                return (
                  <div
                    key={key}
                    className={cn(
                      "rounded-lg border transition-colors duration-150",
                      checked ? "border-foreground/15 bg-surface-2" : "border-border hover:bg-surface-2/60",
                      props.algorithmError && "border-destructive/40"
                    )}
                  >
                    <label
                      htmlFor={`algorithm-${key}`}
                      className="flex cursor-pointer items-center gap-3 px-3 py-2.5"
                    >
                      <Checkbox
                        id={`algorithm-${key}`}
                        checked={checked}
                        onCheckedChange={(v) => props.onAlgorithmToggle(key, v === true)}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "size-2 shrink-0 rounded-[2px] transition-opacity",
                              meta.fill,
                              !checked && "opacity-40"
                            )}
                            aria-hidden
                          />
                          <span className="truncate text-sm text-foreground">{meta.name}</span>
                          <span className="text-xs text-subtle">{meta.short}</span>
                        </span>
                      </span>
                    </label>

                    {name === "RR" && checked && (
                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline px-3 py-2.5 pl-10">
                        <label htmlFor="time-quantum" className="text-xs text-muted-foreground">
                          Time Quantum
                        </label>
                        <NumberStepper
                          id="time-quantum"
                          label="Time Quantum"
                          value={props.timeQuantum}
                          invalid={Boolean(props.timeQuantumError)}
                          describedBy={props.timeQuantumError ? "time-quantum-error" : undefined}
                          onChange={props.onTimeQuantumChange}
                        />
                        {props.timeQuantumError && (
                          <p id="time-quantum-error" className="w-full text-xs text-destructive">
                            {props.timeQuantumError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-2 border-t bg-card px-5 py-4">
          <Button
            id="calculate-primary"
            type="submit"
            size="lg"
            className="h-10 w-full text-sm font-bold"
          >
            คำนวณผลลัพธ์
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={props.onReset}
            className="h-9 w-full text-muted-foreground"
          >
            <RotateCcw aria-hidden />
            ล้างค่า
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

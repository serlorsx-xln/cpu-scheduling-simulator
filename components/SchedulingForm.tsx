"use client";

import ProcessTableInput from "./ProcessTableInput";
import { ALGORITHM_META } from "./algorithm-styles";
import type { AlgorithmName } from "@/lib/scheduling/types";
import type { RawFormInput } from "@/lib/validation";

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

function StepLabel({ no, children }: { no: string; children: string }) {
  return (
    <p className="flex items-baseline gap-2 text-[11px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
      <span className="font-mono text-slate-300">{no}</span>
      {children}
    </p>
  );
}

/** โซน A — ฟอร์มตั้งค่าการจำลอง (คอลัมน์ซ้าย แบบ sticky บนจอใหญ่) */
export default function SchedulingForm(props: SchedulingFormProps) {
  const { algorithms } = props;

  const adjustQuantum = (delta: number) => {
    const current = Number.parseInt(props.timeQuantum, 10);
    const next = Number.isNaN(current) ? 1 : Math.max(1, current + delta);
    props.onTimeQuantumChange(String(next));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit();
      }}
      className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
      aria-label="ฟอร์มตั้งค่าการจำลอง"
    >
      {/* 01 — จำนวนโปรเซส */}
      <section>
        <StepLabel no="01">จำนวนโปรเซส</StepLabel>
        <div className="mt-2.5 flex items-center gap-2.5">
          <input
            id="process-count"
            type="number"
            min={1}
            max={10}
            value={props.processCount}
            onChange={(e) =>
              props.onProcessCountChange(e.target.value === "" ? "" : Number(e.target.value))
            }
            className={`w-20 rounded-lg border px-3 py-2 text-center font-mono tabular text-lg font-semibold transition ${
              props.processCountError
                ? "border-red-400 bg-red-50/60 ring-2 ring-red-100"
                : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none"
            }`}
          />
          <div className="flex gap-1.5">
            {[3, 5, 10].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => props.onProcessCountChange(n)}
                className="rounded-full border border-slate-200 px-3 py-1 font-mono text-xs text-slate-500 transition hover:border-slate-400 hover:text-slate-800"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        {props.processCountError && (
          <p className="mt-1.5 text-xs text-red-600">{props.processCountError}</p>
        )}
      </section>

      {/* 02 — Burst Time */}
      <section>
        <StepLabel no="02">Burst Time</StepLabel>
        <div className="mt-2.5 flex items-center gap-2">
          <div className="grid flex-1 grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
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
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  props.btMode === mode
                    ? "bg-white font-semibold text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {props.btMode === "random" && (
            <button
              type="button"
              onClick={props.onReshuffle}
              title="สุ่มค่า Burst Time ใหม่"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 transition hover:border-slate-400 hover:text-slate-800"
            >
              ⟳
            </button>
          )}
        </div>
        <div className="mt-3">
          <ProcessTableInput
            burstTimes={props.burstTimes}
            readOnly={props.btMode === "random"}
            onChange={props.onBurstTimeChange}
            errorFor={props.burstTimeError}
          />
        </div>
      </section>

      {/* 03 — อัลกอริทึม */}
      <section>
        <StepLabel no="03">อัลกอริทึม</StepLabel>
        <div className="mt-2.5 space-y-2">
          {ALGORITHM_ORDER.map(({ key, name }) => {
            const meta = ALGORITHM_META[name];
            const checked = algorithms[key];
            return (
              <label
                key={key}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                  checked
                    ? `${meta.softBg} ring-2 ${meta.ring} border-transparent`
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={(e) => props.onAlgorithmToggle(key, e.target.checked)}
                />
                <span className={`size-3 rounded-full transition ${meta.dot} ${checked ? "" : "opacity-25"}`} />
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-slate-800">{meta.label}</span>
                  <span className="block text-xs text-slate-500">{meta.tagline}</span>
                </span>
                <span
                  className={`font-mono text-xs transition ${
                    checked ? "text-slate-700" : "text-slate-300"
                  }`}
                  aria-hidden
                >
                  {checked ? "✓" : "○"}
                </span>
              </label>
            );
          })}
        </div>

        {algorithms.rr && (
          <div className="mt-3">
            <label htmlFor="time-quantum" className="block text-xs text-slate-500">
              Time Quantum
            </label>
            <div
              className={`mt-1 inline-flex items-center overflow-hidden rounded-lg border ${
                props.timeQuantumError
                  ? "border-red-400 ring-2 ring-red-100"
                  : "border-slate-200"
              }`}
            >
              <button
                type="button"
                onClick={() => adjustQuantum(-1)}
                aria-label="ลด Time Quantum"
                className="px-3 py-1.5 font-mono text-slate-500 transition hover:bg-slate-50"
              >
                −
              </button>
              <input
                id="time-quantum"
                type="number"
                min={1}
                value={props.timeQuantum}
                onChange={(e) => props.onTimeQuantumChange(e.target.value)}
                className="w-14 border-x border-slate-200 px-2 py-1.5 text-center font-mono tabular font-semibold text-slate-800 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => adjustQuantum(1)}
                aria-label="เพิ่ม Time Quantum"
                className="px-3 py-1.5 font-mono text-slate-500 transition hover:bg-slate-50"
              >
                +
              </button>
            </div>
            {props.timeQuantumError && (
              <p className="mt-1.5 text-xs text-red-600">{props.timeQuantumError}</p>
            )}
          </div>
        )}
      </section>

      {/* actions */}
      <section className="space-y-2 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={props.onSubmit}
          className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-[0.99]"
        >
          คำนวณผลลัพธ์
        </button>
        <button
          type="button"
          onClick={props.onReset}
          className="w-full rounded-xl py-2 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
        >
          ล้างค่า
        </button>
      </section>
    </form>
  );
}

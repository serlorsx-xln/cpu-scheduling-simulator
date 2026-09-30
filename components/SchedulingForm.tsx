"use client";

import ProcessTableInput from "./ProcessTableInput";
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

const ALGORITHM_OPTIONS: { key: keyof AlgorithmFlags; label: string }[] = [
  { key: "fcfs", label: "FCFS" },
  { key: "sjf", label: "SJF (Non-preemptive)" },
  { key: "rr", label: "Round Robin" },
];

/** โซน A — ฟอร์มรับข้อมูลทั้งหมด */
export default function SchedulingForm(props: SchedulingFormProps) {
  const { algorithms } = props;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      aria-label="ฟอร์มตั้งค่าการจำลอง"
    >
      {/* A1: จำนวนโปรเซส */}
      <fieldset className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="process-count" className="block text-sm font-semibold text-slate-700">
          จำนวนโปรเซส (1–10)
        </label>
        <input
          id="process-count"
          type="number"
          min={1}
          max={10}
          value={props.processCount}
          onChange={(e) =>
            props.onProcessCountChange(e.target.value === "" ? "" : Number(e.target.value))
          }
          className={`mt-2 w-28 rounded-md border px-3 py-2 ${
            props.processCountError
              ? "border-red-500 ring-1 ring-red-300"
              : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
          }`}
        />
        {props.processCountError && (
          <p className="mt-1 text-xs text-red-600">{props.processCountError}</p>
        )}
      </fieldset>

      {/* A2: การกำหนด Burst Time */}
      <fieldset className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <legend className="px-1 text-sm font-semibold text-slate-700">
          การกำหนด Burst Time
        </legend>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="bt-mode"
              checked={props.btMode === "random"}
              onChange={() => props.onBtModeChange("random")}
            />
            สุ่มอัตโนมัติ (1–10)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="bt-mode"
              checked={props.btMode === "manual"}
              onChange={() => props.onBtModeChange("manual")}
            />
            กรอกด้วยตนเอง
          </label>
          {props.btMode === "random" && (
            <button
              type="button"
              onClick={props.onReshuffle}
              className="rounded-md bg-slate-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              ⟳ สุ่มใหม่
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
      </fieldset>

      {/* A3: อัลกอริทึม + Time Quantum + ปุ่ม */}
      <fieldset className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <legend className="px-1 text-sm font-semibold text-slate-700">อัลกอริทึม</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {ALGORITHM_OPTIONS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={algorithms[key]}
                onChange={(e) => props.onAlgorithmToggle(key, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>

        {algorithms.rr && (
          <div className="mt-3">
            <label htmlFor="time-quantum" className="block text-sm text-slate-700">
              Time Quantum (RR)
            </label>
            <input
              id="time-quantum"
              type="number"
              min={1}
              value={props.timeQuantum}
              onChange={(e) => props.onTimeQuantumChange(e.target.value)}
              className={`mt-1 w-24 rounded-md border px-3 py-2 ${
                props.timeQuantumError
                  ? "border-red-500 ring-1 ring-red-300"
                  : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
              }`}
            />
            {props.timeQuantumError && (
              <p className="mt-1 text-xs text-red-600">{props.timeQuantumError}</p>
            )}
          </div>
        )}

        <div className="mt-4 flex gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={props.onSubmit}
            className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
          >
            ▶ คำนวณ
          </button>
          <button
            type="button"
            onClick={props.onReset}
            className="rounded-md border border-slate-300 px-6 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            ล้างค่า
          </button>
        </div>
      </fieldset>
    </form>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

import ErrorSummary from "@/components/ErrorSummary";
import ResultCard from "@/components/ResultCard";
import SchedulingForm, {
  type AlgorithmFlags,
  type BtMode,
} from "@/components/SchedulingForm";
import { runSimulation } from "@/lib/scheduling/simulate";
import type { SimulationResult } from "@/lib/scheduling/types";
import { validateInput } from "@/lib/validation";
import type { ValidationIssue } from "@/lib/validation";

function randomBts(n: number): string[] {
  return Array.from({ length: n }, () => String(1 + Math.floor(Math.random() * 10)));
}

const ALGORITHM_NAMES = { fcfs: "FCFS", sjf: "SJF", rr: "RR" } as const;

function resizeBts(current: string[], n: number): string[] {
  const next = current.slice(0, n);
  while (next.length < n) next.push("");
  return next;
}

export default function Home() {
  const [processCount, setProcessCount] = useState<number | "">(3);
  const [btMode, setBtMode] = useState<BtMode>("random");
  const [burstTimes, setBurstTimes] = useState<string[]>(["", "", ""]);
  const [algorithms, setAlgorithms] = useState<AlgorithmFlags>({
    fcfs: true,
    sjf: true,
    rr: true,
  });
  const [timeQuantum, setTimeQuantum] = useState("2");
  const [errors, setErrors] = useState<ValidationIssue[]>([]);
  const [results, setResults] = useState<SimulationResult[] | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  /* eslint-disable react-hooks/set-state-in-effect --
     สุ่มค่า BT เริ่มต้นฝั่ง client เท่านั้น เพื่อไม่ให้ server/client random ไม่ตรงกัน (hydration) */
  useEffect(() => {
    setBurstTimes((current) =>
      current.some((v) => v.trim() === "") ? randomBts(current.length) : current
    );
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function handleProcessCountChange(value: number | "") {
    setProcessCount(value);
    if (value !== "") setBurstTimes((current) => resizeBts(current, value));
  }

  function handleBtModeChange(mode: BtMode) {
    setBtMode(mode);
    // เข้าโหมดสุ่มแล้วยังไม่มีค่าในตาราง → สุ่มให้เลย
    if (mode === "random" && burstTimes.every((v) => v.trim() === "")) {
      setBurstTimes(randomBts(burstTimes.length));
    }
  }

  function handleCalculate() {
    const raw = { processCount, burstTimes, timeQuantum, algorithms };
    const issues = validateInput(raw);
    if (issues.length > 0) {
      setErrors(issues);
      setResults(null);
      return;
    }

    const n = processCount as number;
    setErrors([]);
    setResults(
      runSimulation({
        processes: Array.from({ length: n }, (_, i) => ({
          id: i + 1,
          burstTime: Number(burstTimes[i].trim()),
        })),
        timeQuantum: Number(timeQuantum.trim()),
        algorithms: (["fcfs", "sjf", "rr"] as const)
          .filter((key) => algorithms[key])
          .map((key) => ALGORITHM_NAMES[key]),
      })
    );
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }

  function handleReset() {
    setProcessCount(3);
    setBtMode("random");
    setBurstTimes(randomBts(3));
    setAlgorithms({ fcfs: true, sjf: true, rr: true });
    setTimeQuantum("2");
    setErrors([]);
    setResults(null);
  }

  const processCountError = errors.find((e) => e.field === "processCount")?.message;
  const timeQuantumError = errors.find((e) => e.field === "timeQuantum")?.message;
  function burstTimeError(processId: number): string | undefined {
    const specific = errors.find((e) => e.field === "burstTime" && e.processId === processId);
    if (specific) return specific.message;
    // E5 (ว่างหลายแถว) ไม่ระบุ processId — highlight ทุกแถวที่ยังว่าง
    const blanket = errors.find((e) => e.field === "burstTime" && e.processId === undefined);
    if (blanket && (burstTimes[processId - 1] ?? "").trim() === "") return blanket.message;
    return undefined;
  }

  return (
    <main className="mx-auto max-w-[900px] px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          🖥 CPU Scheduling Simulator
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          FCFS · SJF · Round Robin — ทุกโปรเซสมี Arrival Time = 0
        </p>
      </header>

      <SchedulingForm
        processCount={processCount}
        onProcessCountChange={handleProcessCountChange}
        btMode={btMode}
        onBtModeChange={handleBtModeChange}
        burstTimes={burstTimes}
        onBurstTimeChange={(index, value) =>
          setBurstTimes((current) => current.map((v, i) => (i === index ? value : v)))
        }
        onReshuffle={() => setBurstTimes(randomBts(burstTimes.length))}
        algorithms={algorithms}
        onAlgorithmToggle={(key, checked) =>
          setAlgorithms((current) => ({ ...current, [key]: checked }))
        }
        timeQuantum={timeQuantum}
        onTimeQuantumChange={setTimeQuantum}
        onReset={handleReset}
        onSubmit={handleCalculate}
        processCountError={processCountError}
        burstTimeError={burstTimeError}
        timeQuantumError={timeQuantumError}
      />

      <div className="mt-6">
        <ErrorSummary issues={errors} />
      </div>

      <div ref={resultsRef} className="mt-6 space-y-6">
        {results?.map((result) => <ResultCard key={result.algorithm} result={result} />)}
      </div>
    </main>
  );
}

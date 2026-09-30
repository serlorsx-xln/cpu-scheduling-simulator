"use client";

import { useEffect, useRef, useState } from "react";
import { Clock3, Cpu } from "lucide-react";

import ComparisonSummary from "@/components/ComparisonSummary";
import ErrorSummary from "@/components/ErrorSummary";
import ResultCard from "@/components/ResultCard";
import ResultsPlaceholder from "@/components/ResultsPlaceholder";
import SchedulingForm, {
  type AlgorithmFlags,
  type BtMode,
} from "@/components/SchedulingForm";
import { Badge } from "@/components/ui/badge";
import { runSimulation } from "@/lib/scheduling/simulate";
import type { SimulationResult } from "@/lib/scheduling/types";
import { validateInput } from "@/lib/validation";
import type { ValidationIssue } from "@/lib/validation";

function randomBts(n: number): string[] {
  return Array.from({ length: n }, () => String(1 + Math.floor(Math.random() * 10)));
}

function resizeBts(current: string[], n: number): string[] {
  const next = current.slice(0, n);
  while (next.length < n) next.push("");
  return next;
}

const ALGORITHM_NAMES = { fcfs: "FCFS", sjf: "SJF", rr: "RR" } as const;

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
    if (value === "") return;
    setBurstTimes((current) => {
      const next = resizeBts(current, value);
      // โหมดสุ่ม: แถวใหม่ที่ว่างต้องสุ่มค่าให้ ไม่งั้นช่อง readonly ว่างแก้ไม่ได้
      if (btMode === "random") {
        return next.map((v) =>
          v.trim() === "" ? String(1 + Math.floor(Math.random() * 10)) : v
        );
      }
      return next;
    });
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
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    <div className="min-h-svh bg-background">
      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-12">
        {/* ── Header ──────────────────────────────────────────────── */}
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-3 gap-1.5 font-normal">
              <Cpu className="size-3" aria-hidden />
              Operating Systems · Term Project
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              จำลองการจัดคิวงานของ CPU
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground lg:text-base">
              ประมวลผล FCFS, SJF และ Round Robin ด้วยชุดข้อมูลชุดเดียวกัน
              พร้อมตารางผลลัพธ์ กราฟ Gantt และการเปรียบเทียบเวลารอเฉลี่ย
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock3 className="size-3.5" aria-hidden />
            ทุกโปรเซสมี Arrival Time = 0
          </div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[400px_minmax(0,1fr)]">
          {/* ── คอลัมน์ตั้งค่า (ซ้าย) ─────────────────────────────── */}
          <div className="lg:sticky lg:top-8 lg:max-h-[calc(100svh-4rem)] lg:overflow-y-auto lg:pr-1">
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
          </div>

          {/* ── คอลัมน์ผลลัพธ์ (ขวา) ─────────────────────────────── */}
          <div ref={resultsRef} className="min-w-0 space-y-6">
            <ErrorSummary issues={errors} />

            {results && <ComparisonSummary results={results} />}

            {results?.map((result, i) => (
              <ResultCard key={result.algorithm} result={result} index={i} />
            ))}

            {!results && errors.length === 0 && <ResultsPlaceholder />}
          </div>
        </div>

        <footer className="mt-14 border-t pt-5 pb-2 text-xs text-muted-foreground">
          CPU Scheduling Simulator — โปรเจกต์วิชา Operating Systems · เปรียบเทียบ FCFS /
          SJF / Round Robin ด้วยชุดข้อมูลเดียวกัน
        </footer>
      </main>
    </div>
  );
}

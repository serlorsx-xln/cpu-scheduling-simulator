"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

import AppHeader from "@/components/AppHeader";
import ComparisonSummary from "@/components/ComparisonSummary";
import ErrorSummary from "@/components/ErrorSummary";
import PlaybackBar from "@/components/PlaybackBar";
import QuantumSweep from "@/components/QuantumSweep";
import ResultCard from "@/components/ResultCard";
import ResultsPlaceholder from "@/components/ResultsPlaceholder";
import SchedulingForm, {
  type AlgorithmFlags,
  type BtMode,
} from "@/components/SchedulingForm";
import { TimelineProvider } from "@/components/timeline-context";
import { Button } from "@/components/ui/button";
import { runSimulation } from "@/lib/scheduling/simulate";
import type { SimulationResult } from "@/lib/scheduling/types";
import { validateInput } from "@/lib/validation";
import type { RawFormInput, ValidationIssue } from "@/lib/validation";
import { cn } from "@/lib/utils";

function randomBt(): string {
  return String(1 + Math.floor(Math.random() * 10));
}

function isPositiveIntString(v: string): boolean {
  const n = Number(v.trim());
  return v.trim() !== "" && Number.isInteger(n) && n >= 1;
}

function randomBts(n: number): string[] {
  return Array.from({ length: n }, randomBt);
}

function resizeBts(current: string[], n: number): string[] {
  const next = current.slice(0, n);
  while (next.length < n) next.push("");
  return next;
}

const ALGORITHM_NAMES = { fcfs: "FCFS", sjf: "SJF", rr: "RR" } as const;

/** ชุดข้อมูลอ้างอิงจาก docs/07-HAND-CALCULATION.md */
const SET_A: RawFormInput = {
  processCount: 3,
  burstTimes: ["5", "3", "8"],
  timeQuantum: "2",
  algorithms: { fcfs: true, sjf: true, rr: true },
};

/** ลายนิ้วมือของ input ที่ใช้คำนวณ — เทียบเพื่อบอกว่าผลลัพธ์ที่แสดงยังตรงกับฟอร์มไหม */
function fingerprint(raw: RawFormInput): string {
  const n = raw.processCount === "" ? 0 : raw.processCount;
  return JSON.stringify([
    n,
    raw.burstTimes.slice(0, n).map((v) => v.trim()),
    raw.algorithms.rr ? raw.timeQuantum.trim() : null,
    raw.algorithms,
  ]);
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
  const [computedFrom, setComputedFrom] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);
  const [isMac, setIsMac] = useState(false);
  const [panelButtonVisible, setPanelButtonVisible] = useState(true);
  const [presenting, setPresenting] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  /* eslint-disable react-hooks/set-state-in-effect --
     ค่าที่ขึ้นกับเบราว์เซอร์ (สุ่ม BT, ระบบปฏิบัติการ) ตั้งฝั่ง client เท่านั้นเพื่อกัน hydration mismatch */
  useEffect(() => {
    setBurstTimes((current) =>
      current.some((v) => v.trim() === "") ? randomBts(current.length) : current
    );
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const target = document.getElementById("calculate-primary");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setPanelButtonVisible(entry.isIntersecting), {
      threshold: 0.5,
    });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  const raw: RawFormInput = { processCount, burstTimes, timeQuantum, algorithms };

  function calculate(input: RawFormInput, { scroll = true }: { scroll?: boolean } = {}) {
    const issues = validateInput(input);
    if (issues.length > 0) {
      setErrors(issues);
      setResults(null);
      setComputedFrom(null);
      return;
    }

    const n = input.processCount as number;
    setErrors([]);
    setResults(
      runSimulation({
        processes: Array.from({ length: n }, (_, i) => ({
          id: i + 1,
          burstTime: Number(input.burstTimes[i].trim()),
        })),
        timeQuantum: Number(input.timeQuantum.trim()),
        algorithms: (["fcfs", "sjf", "rr"] as const)
          .filter((key) => input.algorithms[key])
          .map((key) => ALGORITHM_NAMES[key]),
      })
    );
    setComputedFrom(fingerprint(input));
    setRunId((id) => id + 1);

    // จอเล็ก ผลลัพธ์อยู่ใต้ฟอร์ม → เลื่อนลงไปให้เห็น; จอใหญ่เห็นอยู่แล้ว
    if (scroll && window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() =>
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      );
    }
  }

  const handleCalculate = () => calculate(raw);

  // ⌘/Ctrl + Enter คำนวณได้จากทุกที่ในหน้า — effect event อ่านค่าฟอร์มล่าสุดโดยไม่ต้องผูก listener ใหม่
  const onShortcut = useEffectEvent(() => calculate(raw));
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        onShortcut();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handlePickQuantum(q: number) {
    setTimeQuantum(String(q));
    calculate({ ...raw, timeQuantum: String(q) }, { scroll: false });
  }

  // โหมดนำเสนอ: ขยายสเกลตัวอักษรทั้งหน้า (ทุกขนาดเป็น rem) + เต็มจอถ้าเบราว์เซอร์อนุญาต
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = presenting ? "18px" : "";
    if (presenting && !document.fullscreenElement) {
      root.requestFullscreen?.().catch(() => {});
    } else if (!presenting && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }, [presenting]);
  useEffect(() => {
    // กด Esc ออกจากเต็มจอ = ออกจากโหมดนำเสนอด้วย
    const onChange = () => {
      if (!document.fullscreenElement) setPresenting(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function handleProcessCountChange(value: number | "") {
    setProcessCount(value);
    if (value === "" || !Number.isInteger(value) || value < 1 || value > 10) return;
    setBurstTimes((current) => {
      const next = resizeBts(current, value);
      // โหมดสุ่ม: แถวใหม่ต้องมีค่า ไม่งั้นช่อง readonly จะว่างและแก้ไม่ได้
      return btMode === "random" ? next.map((v) => (isPositiveIntString(v) ? v : randomBt())) : next;
    });
  }

  function handleBtModeChange(mode: BtMode) {
    setBtMode(mode);
    // เข้าโหมดสุ่ม: ช่องจะเป็น readonly จึงต้องแทนค่าที่ว่างหรือไม่ถูกต้องด้วยค่าสุ่ม
    // (ค่าที่ถูกต้องคงไว้ — สลับโหมดไม่ลบค่าที่กรอกไว้ ตาม docs/03 §3.4)
    if (mode === "random" && burstTimes.some((v) => !isPositiveIntString(v))) {
      setBurstTimes((current) => current.map((v) => (isPositiveIntString(v) ? v : randomBt())));
    }
  }

  function handleLoadSample() {
    setProcessCount(3);
    setBtMode("manual");
    setBurstTimes([...SET_A.burstTimes]);
    setAlgorithms({ ...SET_A.algorithms });
    setTimeQuantum(SET_A.timeQuantum);
    calculate(SET_A);
  }

  function handleReset() {
    setProcessCount(3);
    setBtMode("random");
    setBurstTimes(randomBts(3));
    setAlgorithms({ fcfs: true, sjf: true, rr: true });
    setTimeQuantum("2");
    setErrors([]);
    setResults(null);
    setComputedFrom(null);
  }

  const processCountError = errors.find((e) => e.field === "processCount")?.message;
  const timeQuantumError = errors.find((e) => e.field === "timeQuantum")?.message;
  const algorithmError = errors.find((e) => e.field === "algorithm")?.message;
  function burstTimeError(processId: number): string | undefined {
    const specific = errors.find((e) => e.field === "burstTime" && e.processId === processId);
    if (specific) return specific.message;
    // E5 (ว่างหลายแถว) ไม่ระบุ processId — แสดงที่ทุกแถวที่ยังว่าง
    const blanket = errors.find((e) => e.field === "burstTime" && e.processId === undefined);
    if (blanket && (burstTimes[processId - 1] ?? "").trim() === "") return blanket.message;
    return undefined;
  }
  const firstEmptyBt = Math.max(1, burstTimes.findIndex((v) => v.trim() === "") + 1);

  const isStale = results !== null && computedFrom !== fingerprint(raw);
  const total = results?.[0]?.gantt.at(-1)?.end ?? 0;
  const rrResult = results?.find((r) => r.algorithm === "RR") ?? null;
  const bestAvg = results && results.length > 1 ? Math.min(...results.map((r) => r.avgWaitingTime)) : null;

  return (
    <div className="min-h-svh pb-24 lg:pb-0">
      <AppHeader
        onLoadSample={handleLoadSample}
        isMac={isMac}
        presenting={presenting}
        onTogglePresent={() => setPresenting((v) => !v)}
        onPrint={() => window.print()}
        canPrint={results !== null}
      />

      <main
        className={cn(
          "mx-auto grid max-w-[1400px] items-start gap-6 px-4 py-6 lg:px-6 lg:py-8 print:block print:max-w-none print:p-0",
          presenting && results ? "max-w-[1200px]" : "lg:grid-cols-[360px_minmax(0,1fr)]"
        )}
      >
        <aside
          className={cn(
            "lg:sticky lg:top-[5.5rem] lg:flex lg:max-h-[calc(100svh-7rem)] lg:flex-col print:hidden",
            presenting && results && "hidden lg:hidden"
          )}
        >
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
            algorithmError={algorithmError}
          />
        </aside>

        <div ref={resultsRef} className="min-w-0 scroll-mt-20 space-y-6">
          <ErrorSummary issues={errors} firstEmptyBt={firstEmptyBt} />

          {results && (
            <TimelineProvider key={runId} total={total}>
              <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                <div>
                  <h2 className="text-xl font-bold text-foreground">ผลลัพธ์</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {results[0].processes.length} โปรเซส
                    <span className="mx-2 text-subtle">·</span>
                    BT {results[0].processes.map((p) => p.burstTime).join(", ")}
                    <span className="mx-2 text-subtle">·</span>
                    รวม {total} หน่วยเวลา
                  </p>
                </div>
                {presenting && (
                  <Button type="button" size="sm" variant="outline" onClick={() => setPresenting(false)} className="print:hidden">
                    แก้ค่าที่ป้อน
                  </Button>
                )}
                {isStale && (
                  <div
                    role="status"
                    className="flex items-center gap-3 rounded-lg border bg-surface-2 py-1.5 pr-1.5 pl-3 text-sm text-muted-foreground"
                  >
                    ค่าในฟอร์มเปลี่ยนแล้ว
                    <Button type="button" size="sm" variant="secondary" onClick={handleCalculate}>
                      <RefreshCw aria-hidden />
                      คำนวณใหม่
                    </Button>
                  </div>
                )}
              </div>

              <PlaybackBar />

              <ComparisonSummary results={results} />

              {rrResult && (
                <QuantumSweep
                  burstTimes={rrResult.processes.map((p) => p.burstTime)}
                  currentQuantum={rrResult.timeQuantum ?? 1}
                  onPickQuantum={handlePickQuantum}
                />
              )}

              {results.map((result, i) => (
                <ResultCard
                  key={result.algorithm}
                  result={result}
                  index={i}
                  isBest={bestAvg !== null && result.avgWaitingTime === bestAvg}
                />
              ))}
            </TimelineProvider>
          )}

          {!results && errors.length === 0 && (
            <ResultsPlaceholder onCalculate={handleCalculate} onLoadSample={handleLoadSample} />
          )}

          <footer className="border-t pt-5 pb-2 text-xs leading-relaxed text-subtle">
            Term Project วิชา Operating Systems · ทุกโปรเซสมี Arrival Time = 0 · TAT = CT − AT ·
            WT = TAT − BT · ค่าเฉลี่ยแสดงทศนิยม 2 ตำแหน่ง
          </footer>
        </div>
      </main>

      {/* จอเล็ก: ปุ่มคำนวณติดขอบล่างเสมอ ไม่ต้องเลื่อนกลับขึ้นไปหาฟอร์ม */}
      <div
        aria-hidden={panelButtonVisible}
        inert={panelButtonVisible}
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-200 ease-out lg:hidden print:hidden",
          panelButtonVisible && "translate-y-full"
        )}
      >
        <Button type="button" size="lg" className="h-11 w-full text-sm font-bold" onClick={handleCalculate}>
          คำนวณผลลัพธ์
        </Button>
      </div>
    </div>
  );
}

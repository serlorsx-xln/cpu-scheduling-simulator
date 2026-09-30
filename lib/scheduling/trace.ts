import { runSimulation } from "./simulate";
import type { AlgorithmName } from "./types";

/**
 * หนึ่งก้าวของการจัดคิว = โปรเซสหนึ่งได้ CPU ต่อเนื่องหนึ่งช่วง (ตรงกับ Gantt segment หนึ่งอัน)
 * ใช้แสดง "วิธีคิดทีละขั้น" แบบเดียวกับตารางคำนวณมือใน docs/07 และภาพ Ready Queue
 */
export interface TraceStep {
  /** ลำดับก้าว 1-based */
  index: number
  processId: number
  start: number
  end: number
  /** คิวพร้อมทำงาน ณ ตอนเลือก (รวมตัวที่ถูกเลือกไว้หน้าสุด) ตามกติกาของอัลกอริทึม */
  ready: number[]
  /** เวลาที่เหลือของโปรเซสนี้ก่อน/หลังรันก้าวนี้ */
  remainingBefore: number
  remainingAfter: number
  /** คิวหลังจบก้าว (RR: ตัวที่ยังไม่เสร็จต่อท้ายคิว) */
  queueAfter: number[]
  /** จบก้าวนี้แล้วโปรเซสเสร็จ (เวลานั้นคือ CT) หรือถูกพักกลับท้ายคิว (RR) */
  outcome: "complete" | "preempted"
}

/**
 * FCFS / SJF: ไม่แทรกกลางคัน → ก้าวละหนึ่งโปรเซส
 * คิวพร้อมทำงาน = โปรเซสที่ยังไม่ได้รัน เรียงตามกติกา (FCFS: เลขโปรเซส, SJF: BT แล้วเลขโปรเซส)
 * กติกาเดียวกับ fcfs.ts / sjf.ts — test ยืนยันว่า start/end ตรงกับ Gantt ทุกก้าว
 */
function traceNonPreemptive(burstTimes: number[], order: "arrival" | "shortest"): TraceStep[] {
  let pending = burstTimes.map((_, i) => i + 1);
  if (order === "shortest") {
    pending = [...pending].sort((a, b) => burstTimes[a - 1] - burstTimes[b - 1] || a - b);
  }
  const steps: TraceStep[] = [];
  let t = 0;
  while (pending.length > 0) {
    const [id, ...rest] = pending;
    const bt = burstTimes[id - 1];
    steps.push({
      index: steps.length + 1,
      processId: id,
      start: t,
      end: t + bt,
      ready: [...pending],
      remainingBefore: bt,
      remainingAfter: 0,
      queueAfter: rest,
      outcome: "complete",
    });
    t += bt;
    pending = rest;
  }
  return steps;
}

/** RR: คิววนตามลำดับ P1→Pn รันได้ไม่เกิน quantum ไม่เสร็จกลับท้ายคิว — กติกาเดียวกับ rr.ts */
function traceRoundRobin(burstTimes: number[], quantum: number): TraceStep[] {
  const remaining = [...burstTimes];
  const queue = burstTimes.map((_, i) => i + 1);
  const steps: TraceStep[] = [];
  let t = 0;
  while (queue.length > 0) {
    const ready = [...queue];
    const id = queue.shift() as number;
    const before = remaining[id - 1];
    const run = Math.min(quantum, before);
    remaining[id - 1] -= run;
    const done = remaining[id - 1] === 0;
    if (!done) queue.push(id);
    steps.push({
      index: steps.length + 1,
      processId: id,
      start: t,
      end: t + run,
      ready,
      remainingBefore: before,
      remainingAfter: remaining[id - 1],
      queueAfter: [...queue],
      outcome: done ? "complete" : "preempted",
    });
    t += run;
  }
  return steps;
}

export function traceSchedule(
  algorithm: AlgorithmName,
  burstTimes: number[],
  quantum: number
): TraceStep[] {
  switch (algorithm) {
    case "FCFS":
      return traceNonPreemptive(burstTimes, "arrival");
    case "SJF":
      return traceNonPreemptive(burstTimes, "shortest");
    case "RR":
      return traceRoundRobin(burstTimes, quantum);
  }
}

/** ก้าวที่ครอบคลุมหน่วยเวลา [t, t+1) — null เมื่ออยู่นอก timeline */
export function stepAt(steps: TraceStep[], t: number): TraceStep | null {
  return steps.find((s) => t >= s.start && t < s.end) ?? null;
}

/** สถานะ ณ หน่วยเวลา [t, t+1): ใครใช้ CPU, คิวที่รอ (ตามลำดับ), ใครเสร็จแล้ว */
export function stateAt(steps: TraceStep[], t: number) {
  const step = stepAt(steps, t);
  const done = steps.filter((s) => s.outcome === "complete" && s.end <= t).map((s) => s.processId);
  return {
    step,
    running: step?.processId ?? null,
    waiting: step ? step.ready.slice(1) : [],
    done,
  };
}

export interface QuantumPoint {
  quantum: number
  avgWaitingTime: number
  avgTurnaroundTime: number
}

/**
 * AVG WT ของ Round Robin เมื่อ q = 1…qMax (ค่าเริ่ม: BT มากสุด — จาก q นั้นขึ้นไป RR เท่ากับ FCFS)
 * ใช้ runSimulation ตัวเดียวกับหน้าผลลัพธ์ ค่าจึงตรงกับการ์ดทุกตัว
 */
export function quantumSweep(burstTimes: number[], qMax = Math.max(...burstTimes)): QuantumPoint[] {
  const processes = burstTimes.map((bt, i) => ({ id: i + 1, burstTime: bt }));
  return Array.from({ length: Math.max(1, qMax) }, (_, i) => {
    const [rr] = runSimulation({ processes, timeQuantum: i + 1, algorithms: ["RR"] });
    return {
      quantum: i + 1,
      avgWaitingTime: rr.avgWaitingTime,
      avgTurnaroundTime: rr.avgTurnaroundTime,
    };
  });
}

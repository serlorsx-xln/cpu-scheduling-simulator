import type { TraceStep } from "@/lib/scheduling/trace";
import type { AlgorithmName } from "@/lib/scheduling/types";

/** ชื่อคิวตามกติกาของแต่ละอัลกอริทึม */
export const QUEUE_LABEL: Record<AlgorithmName, string> = {
  FCFS: "คิว (ตามลำดับที่มาถึง)",
  SJF: "พร้อมทำงาน (เรียง BT น้อย → มาก)",
  RR: "Ready Queue (หัว → ท้าย)",
};

/** เหตุผลที่ก้าวนี้เลือกโปรเซสนี้ — ภาษาเดียวกับที่ใช้อธิบายในการคำนวณมือ */
export function selectionReason(
  algorithm: AlgorithmName,
  step: TraceStep,
  burstTimes: number[],
  quantum: number
): string {
  const id = step.processId;
  switch (algorithm) {
    case "FCFS":
      return `มาถึงก่อน — P${id} อยู่หน้าคิว`;
    case "SJF": {
      const bt = burstTimes[id - 1];
      const ties = step.ready.filter((p) => p !== id && burstTimes[p - 1] === bt);
      return ties.length > 0
        ? `BT = ${bt} น้อยที่สุด เท่ากับ ${ties.map((p) => `P${p}`).join(", ")} → เลขน้อยกว่าก่อน`
        : `BT = ${bt} น้อยที่สุดในคิว`;
    }
    case "RR":
      return `หัวคิว — รัน min(q ${quantum}, เหลือ ${step.remainingBefore}) = ${step.end - step.start}`;
  }
}

export function outcomeText(step: TraceStep): string {
  return step.outcome === "complete"
    ? `P${step.processId} เสร็จ · CT = ${step.end}`
    : `P${step.processId} ยังเหลือ ${step.remainingAfter} → กลับท้ายคิว`;
}

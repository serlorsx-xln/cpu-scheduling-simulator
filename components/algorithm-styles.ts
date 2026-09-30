import type { AlgorithmName } from "@/lib/scheduling/types";

/**
 * ข้อมูลประจำอัลกอริทึม — แหล่งเดียวของสี ป้ายกำกับ และคำอธิบาย
 * ธีม premium dark: สีจางลงเมื่อเป็นพื้น (opacity ต่ำ) สว่างขึ้นเมื่อเป็นตัว
 * คลาสสีเป็น literal เพื่อให้ Tailwind JIT มองเห็น
 */
export const ALGORITHM_META: Record<
  AlgorithmName,
  {
    label: string
    fullName: string
    tagline: string
    dot: string
    bar: string
    softBg: string
    ring: string
    text: string
    border: string
  }
> = {
  FCFS: {
    label: "FCFS",
    fullName: "First-Come, First-Served",
    tagline: "เข้าก่อน–ออกก่อน ไม่มีการแทรก",
    dot: "bg-sky-400",
    bar: "bg-sky-400",
    softBg: "bg-sky-400/10",
    ring: "ring-sky-400/40",
    text: "text-sky-300",
    border: "border-sky-400/30",
  },
  SJF: {
    label: "SJF",
    fullName: "Shortest Job First",
    tagline: "งานสั้นสุดก่อน (แบบไม่แทรก)",
    dot: "bg-emerald-400",
    bar: "bg-emerald-400",
    softBg: "bg-emerald-400/10",
    ring: "ring-emerald-400/40",
    text: "text-emerald-300",
    border: "border-emerald-400/30",
  },
  RR: {
    label: "RR",
    fullName: "Round Robin",
    tagline: "แบ่งเวลาตาม Time Quantum",
    dot: "bg-amber-400",
    bar: "bg-amber-400",
    softBg: "bg-amber-400/10",
    ring: "ring-amber-400/40",
    text: "text-amber-300",
    border: "border-amber-400/30",
  },
};

/** สีแท่ง Gantt ต่อโปรเซส — hue วน 8 สี โทน 400 เข้ากับพื้นเข้ม ตัวอักษรบนแท่งเป็นสีเข้ม */
export const PROCESS_BAR_COLORS = [
  "bg-sky-400",
  "bg-violet-400",
  "bg-emerald-400",
  "bg-amber-400",
  "bg-rose-400",
  "bg-teal-400",
  "bg-indigo-400",
  "bg-fuchsia-400",
];

export function processBarColor(processId: number): string {
  return PROCESS_BAR_COLORS[(processId - 1) % PROCESS_BAR_COLORS.length];
}

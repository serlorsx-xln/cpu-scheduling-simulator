import type { AlgorithmName } from "@/lib/scheduling/types";

/** สีและข้อความประจำอัลกอริทึม — แหล่งเดียวที่ใช้ในฟอร์ม การ์ดผลลัพธ์ และแผงเปรียบเทียบ */
export const ALGORITHM_META: Record<
  AlgorithmName,
  { label: string; tagline: string; dot: string; bar: string; softBg: string; ring: string }
> = {
  FCFS: {
    label: "FCFS",
    tagline: "First-Come, First-Served",
    dot: "bg-blue-500",
    bar: "bg-blue-600",
    softBg: "bg-blue-50",
    ring: "ring-blue-500",
  },
  SJF: {
    label: "SJF",
    tagline: "Shortest Job First (Non-preemptive)",
    dot: "bg-emerald-500",
    bar: "bg-emerald-600",
    softBg: "bg-emerald-50",
    ring: "ring-emerald-500",
  },
  RR: {
    label: "Round Robin",
    tagline: "แบ่งเวลาตาม Time Quantum",
    dot: "bg-orange-500",
    bar: "bg-orange-500",
    softBg: "bg-orange-50",
    ring: "ring-orange-500",
  },
};

/** สีแท่ง Gantt ของแต่ละโปรเซส — วนตาม id (ชื่อ class เป็นลิตรอลเพื่อให้ Tailwind JIT generate) */
export const PROCESS_BAR_COLORS = [
  "bg-sky-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-fuchsia-500",
];

export function processBarColor(processId: number): string {
  return PROCESS_BAR_COLORS[(processId - 1) % PROCESS_BAR_COLORS.length];
}

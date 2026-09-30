import type { AlgorithmName } from "@/lib/scheduling/types";

/**
 * ข้อมูลประจำอัลกอริทึม — แหล่งเดียวของชื่อ คำอธิบาย และสี
 * สีคือ "ข้อมูล": ใช้กับ mark (จุด แท่ง เส้น) เท่านั้น ข้อความใช้ text token เสมอ
 * ค่า hex อยู่ใน globals.css (--algo-*) ผ่าน validator แล้ว; ที่นี่เก็บชื่อคลาสแบบ literal ให้ Tailwind เห็น
 */
export const ALGORITHM_META: Record<
  AlgorithmName,
  {
    short: string
    name: string
    rule: string
    /** พื้นหลังของ mark */
    fill: string
    /** เส้นขอบ/วงแหวน (ใช้ตอนเลือก) */
    ring: string
    /** ค่า CSS variable สำหรับ style inline */
    cssVar: string
  }
> = {
  FCFS: {
    short: "FCFS",
    name: "First-Come, First-Served",
    rule: "ทำตามลำดับที่เข้าคิว P1 → Pn จนเสร็จทีละตัว",
    fill: "bg-fcfs",
    ring: "ring-fcfs/60",
    cssVar: "var(--algo-fcfs)",
  },
  SJF: {
    short: "SJF",
    name: "Shortest Job First",
    rule: "เลือก Burst Time น้อยสุดก่อน ไม่แทรกกลางคัน (เท่ากัน → เลขน้อยก่อน)",
    fill: "bg-sjf",
    ring: "ring-sjf/60",
    cssVar: "var(--algo-sjf)",
  },
  RR: {
    short: "RR",
    name: "Round Robin",
    rule: "วนคิวให้คนละไม่เกิน Time Quantum ยังไม่เสร็จกลับไปต่อท้าย",
    fill: "bg-rr",
    ring: "ring-rr/60",
    cssVar: "var(--algo-rr)",
  },
};

export const ALGORITHM_ORDER: AlgorithmName[] = ["FCFS", "SJF", "RR"];

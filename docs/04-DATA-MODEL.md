# 4. Data Model — TypeScript Interfaces

> เป็น contract กลางที่ทุกส่วนอ้างอิง อยู่ที่ `lib/scheduling/types.ts` และ `lib/validation.ts`

## 4.1 types.ts

```ts
/** โปรเซสหนึ่งตัวในชุดข้อมูล (AT fix เป็น 0 ตามโจทย์ จึงไม่เก็บใน struct) */
export interface ProcessInput {
  id: number          // 1-based: P1, P2, ...
  burstTime: number   // จำนวนเต็มบวก (ผ่าน validation แล้ว)
}

/** ช่วงหนึ่งที่ CPU ทำงานโปรเซสเดียวต่อเนื่อง — ใช้วาด Gantt */
export interface GanttSegment {
  processId: number   // id ของโปรเซส
  start: number       // เวลาเริ่ม segment
  end: number         // เวลาจบ segment (end - start = เวลาที่ได้รับในครั้งนั้น)
}

/** ผลลัพธ์รายโปรเซสของ 1 อัลกอริทึม */
export interface ProcessResult {
  id: number
  burstTime: number
  startTime: number        // ครั้งแรกที่ได้ CPU
  completionTime: number
  turnaroundTime: number   // = CT - AT = CT
  waitingTime: number      // = TAT - BT
}

/** ผลลัพธ์ของ 1 อัลกอริทึม (1 การ์ดใน UI) */
export interface SimulationResult {
  algorithm: "FCFS" | "SJF" | "RR"
  timeQuantum?: number     // มีเฉพาะ RR
  processes: ProcessResult[]
  avgWaitingTime: number
  avgTurnaroundTime: number
  gantt: GanttSegment[]
}

/** input รวมของการ simulate หนึ่งครั้ง */
export interface SimulationInput {
  processes: ProcessInput[]
  timeQuantum: number
  algorithms: Array<"FCFS" | "SJF" | "RR">
}
```

## 4.2 validation.ts

```ts
export interface ValidationIssue {
  field: "processCount" | "burstTime" | "timeQuantum" | "algorithm"
  processId?: number     // ระบุแถวที่ผิด (กรณี burstTime)
  message: string        // ข้อความภาษาไทย — ข้อความมาตรฐานดู [02-REQUIREMENTS §2.5](02-REQUIREMENTS.md)
}

export function validateInput(raw: RawFormInput): ValidationIssue[]
```

## 4.3 Signature ของฟังก์ชันหลัก

| ฟังก์ชัน | Signature | หมายเหตุ |
|---|---|---|
| `simulateFcfs` | `(bt: number[]) => { results, gantt }` | รันตามลำดับ array |
| `simulateSjf` | `(bt: number[]) => { results, gantt }` | BT น้อยสุดก่อน, tie → เลขโปรเซสน้อยก่อน |
| `simulateRr` | `(bt: number[], q: number) => { results, gantt }` | queue วน, preempt เมื่อครบ q |
| `runSimulation` | `(input: SimulationInput) => SimulationResult[]` | เรียกตามอัลกอริทึมที่เลือก + คำนวณ TAT/WT/AVG รวมให้ |
| `validateInput` | `(raw) => ValidationIssue[]` | คืน array ว่าง = ผ่านทั้งหมด |

## 4.4 แบ่งชั้นความรับผิดชอบผลลัพธ์

ผลชั้นใน (`{ results, gantt }`) แยกจากผลชั้นนอก (`SimulationResult`) โดยตั้งใจ:

- ตัวอัลกอริทึม (fcfs/sjf/rr) คำนวณแค่ **ST, CT และ Gantt** — ไม่รู้จักสูตร TAT/WT
- การคำนวณ `TAT = CT − AT`, `WT = TAT − BT`, `AVG WT`, `AVG TAT` ทำที่เดียวใน `simulate.ts`
- จึงแก้สูตร metrics ที่จุดเดียว และต่อยอดรองรับ AT ≠ 0 ในอนาคตได้โดยไม่แตะตัวอัลกอริทึม

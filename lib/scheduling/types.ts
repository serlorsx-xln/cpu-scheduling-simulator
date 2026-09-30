/** โปรเซสหนึ่งตัวในชุดข้อมูล (AT fix เป็น 0 ตามโจทย์ จึงไม่เก็บใน struct) */
export interface ProcessInput {
  /** 1-based: P1, P2, ... */
  id: number
  /** จำนวนเต็มบวก (ผ่าน validation แล้ว) */
  burstTime: number
}

/** ช่วงหนึ่งที่ CPU ทำงานโปรเซสเดียวต่อเนื่อง — ใช้วาด Gantt */
export interface GanttSegment {
  processId: number
  start: number
  end: number
}

/** ผลลัพธ์รายโปรเซสของ 1 อัลกอริทึม */
export interface ProcessResult {
  id: number
  burstTime: number
  /** เวลาที่ได้ CPU ครั้งแรก */
  startTime: number
  completionTime: number
  /** = CT - AT = CT (เพราะ AT = 0) */
  turnaroundTime: number
  /** = TAT - BT */
  waitingTime: number
}

export type AlgorithmName = "FCFS" | "SJF" | "RR"

/** ผลลัพธ์ของ 1 อัลกอริทึม (1 การ์ดใน UI) */
export interface SimulationResult {
  algorithm: AlgorithmName
  /** มีเฉพาะ RR */
  timeQuantum?: number
  processes: ProcessResult[]
  avgWaitingTime: number
  avgTurnaroundTime: number
  gantt: GanttSegment[]
}

/** input รวมของการ simulate หนึ่งครั้ง */
export interface SimulationInput {
  processes: ProcessInput[]
  timeQuantum: number
  algorithms: AlgorithmName[]
}

/** ผลดิบจากตัวอัลกอริทึม (ยังไม่รวมสูตร TAT/WT — คำนวณที่ simulate.ts จุดเดียว) */
export interface AlgorithmOutput {
  /** index 0 = P1, index 1 = P2, ... */
  startTime: number[]
  completionTime: number[]
  gantt: GanttSegment[]
}

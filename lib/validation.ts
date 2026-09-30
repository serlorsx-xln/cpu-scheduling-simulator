/** input ดิบจากฟอร์มก่อนตรวจสอบ */
export interface RawFormInput {
  /** ค่าจากช่องจำนวนโปรเซส — "" เมื่อว่าง */
  processCount: number | ""
  /** ค่าดิบจากช่อง BT รายแถว (ยังไม่ parse) */
  burstTimes: string[]
  /** ค่าดิบจากช่อง Time Quantum */
  timeQuantum: string
  algorithms: { fcfs: boolean; sjf: boolean; rr: boolean }
}

export interface ValidationIssue {
  field: "processCount" | "burstTime" | "timeQuantum" | "algorithm"
  /** ระบุแถวโปรเซสที่ผิด (กรณี burstTime) */
  processId?: number
  message: string
}

const MAX_PROCESSES = 10;

function isPositiveInt(value: number): boolean {
  return Number.isInteger(value) && value >= 1;
}

/** แยก "ว่าง" ออกจาก "กรอกแต่ค่าไม่ถูก" เพื่อเลือกข้อความ E4/E5 */
function parseBurstTime(raw: string): { value: number | null; empty: boolean } {
  const trimmed = raw.trim();
  if (trimmed === "") return { value: null, empty: true };
  const value = Number(trimmed);
  return { value: isPositiveInt(value) ? value : null, empty: false };
}

/**
 * ตรวจ input ทั้งหมดตามกฎ E1–E7 (docs/02-REQUIREMENTS §2.5)
 * คืน array ว่างเมื่อผ่านทุกกฎ
 */
export function validateInput(raw: RawFormInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // E1–E3: จำนวนโปรเซส
  if (raw.processCount === "") {
    issues.push({ field: "processCount", message: "กรุณากรอกจำนวนโปรเซส" });
  } else if (!isPositiveInt(raw.processCount)) {
    issues.push({ field: "processCount", message: "จำนวนโปรเซสต้องเป็นจำนวนเต็มบวก" });
  } else if (raw.processCount > MAX_PROCESSES) {
    issues.push({ field: "processCount", message: `จำนวนโปรเซสต้องไม่เกิน ${MAX_PROCESSES}` });
  }

  // E4/E5: Burst Time — ตรวจเฉพาะเมื่อจำนวนโปรเซสถูกต้อง (ไม่งั้นไม่รู้ว่าต้องมีกี่แถว)
  const n = raw.processCount === "" ? 0 : isPositiveInt(raw.processCount) ? raw.processCount : 0;
  if (n > 0) {
    const rows = raw.burstTimes.slice(0, n);
    const parsed = rows.map(parseBurstTime);
    const emptyRows = parsed.filter((p) => p.empty).length;

    if (emptyRows > 1) {
      issues.push({ field: "burstTime", message: "กรุณากรอก Burst Time ให้ครบทุกโปรเซส" });
    } else if (emptyRows === 1) {
      const index = parsed.findIndex((p) => p.empty);
      issues.push({
        field: "burstTime",
        processId: index + 1,
        message: `Burst Time ของ P${index + 1} ต้องเป็นจำนวนเต็มบวก`,
      });
    } else {
      parsed.forEach((p, index) => {
        if (p.value === null) {
          issues.push({
            field: "burstTime",
            processId: index + 1,
            message: `Burst Time ของ P${index + 1} ต้องเป็นจำนวนเต็มบวก`,
          });
        }
      });
    }
  }

  // E6: Time Quantum (เฉพาะเมื่อเลือก RR)
  if (raw.algorithms.rr) {
    const q = Number(raw.timeQuantum.trim());
    if (!isPositiveInt(q)) {
      issues.push({ field: "timeQuantum", message: "Time Quantum ต้องเป็นจำนวนเต็มบวก" });
    }
  }

  // E7: ต้องเลือกอัลกอริทึมอย่างน้อย 1 แบบ
  if (!raw.algorithms.fcfs && !raw.algorithms.sjf && !raw.algorithms.rr) {
    issues.push({ field: "algorithm", message: "กรุณาเลือกอัลกอริทึมอย่างน้อย 1 แบบ" });
  }

  return issues;
}

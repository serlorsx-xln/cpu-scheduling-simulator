import { describe, expect, it } from "vitest";

import { simulateFcfs } from "../lib/scheduling/fcfs";
import { simulateRr } from "../lib/scheduling/rr";
import { runSimulation } from "../lib/scheduling/simulate";
import { simulateSjf } from "../lib/scheduling/sjf";
import type { SimulationResult } from "../lib/scheduling/types";
import { validateInput } from "../lib/validation";
import type { RawFormInput } from "../lib/validation";

// SET-A: ชุดข้อมูลอ้างอิงจาก docs/07-HAND-CALCULATION.md (P1=5, P2=3, P3=8, q=2)
const SET_A = [5, 3, 8];
const SET_A_TOTAL_BT = 16;

/** ตรวจ invariant U-I1..U-I5 ที่ต้องจริงทุกอัลกอริทึมทุกเคส */
function expectValidInvariants(result: SimulationResult, burstTimes: number[]) {
  for (const p of result.processes) {
    // U-I1: TAT = CT (AT = 0) และ U-I2: WT = TAT - BT
    expect(p.turnaroundTime).toBe(p.completionTime);
    expect(p.waitingTime).toBe(p.turnaroundTime - p.burstTime);
    expect(p.startTime).toBeLessThanOrEqual(p.completionTime);
    expect(p.waitingTime).toBeGreaterThanOrEqual(0);
  }
  // U-I3: Σ ความยาว Gantt = Σ BT
  const ganttSpan = result.gantt.reduce((acc, seg) => acc + (seg.end - seg.start), 0);
  expect(ganttSpan).toBe(burstTimes.reduce((a, b) => a + b, 0));
  // U-I4: Gantt ต่อเนื่อง
  for (let i = 1; i < result.gantt.length; i++) {
    expect(result.gantt[i].start).toBe(result.gantt[i - 1].end);
  }
  // U-I5: AVG ตรงกับค่าที่คำนวณจากตาราง (ปัดทศนิยม 2 ตำแหน่ง)
  const n = result.processes.length;
  const sumWt = result.processes.reduce((acc, p) => acc + p.waitingTime, 0);
  const sumTat = result.processes.reduce((acc, p) => acc + p.turnaroundTime, 0);
  expect(result.avgWaitingTime).toBe(Math.round((sumWt / n) * 100) / 100);
  expect(result.avgTurnaroundTime).toBe(Math.round((sumTat / n) * 100) / 100);
}

describe("FCFS", () => {
  it("U-F1: SET-A ได้ ST/CT/WT ตรงค่าคำนวณมือ", () => {
    const out = simulateFcfs(SET_A);
    expect(out.startTime).toEqual([0, 5, 8]);
    expect(out.completionTime).toEqual([5, 8, 16]);
    expect(out.gantt).toEqual([
      { processId: 1, start: 0, end: 5 },
      { processId: 2, start: 5, end: 8 },
      { processId: 3, start: 8, end: 16 },
    ]);
  });

  it("U-F2: โปรเซสเดียว ST = 0, CT = BT, WT = 0", () => {
    const out = simulateFcfs([7]);
    expect(out.startTime).toEqual([0]);
    expect(out.completionTime).toEqual([7]);
  });

  it("U-F3: BT = 1 ทุกตัว เรียง P1,P2,P3", () => {
    const out = simulateFcfs([1, 1, 1]);
    expect(out.completionTime).toEqual([1, 2, 3]);
  });
});

describe("SJF (Non-preemptive)", () => {
  it("U-S1: SET-A เลือกลำดับ P2,P1,P3", () => {
    const out = simulateSjf(SET_A);
    expect(out.startTime).toEqual([3, 0, 8]);
    expect(out.completionTime).toEqual([8, 3, 16]);
    expect(out.gantt.map((g) => g.processId)).toEqual([2, 1, 3]);
  });

  it("U-S2: BT เท่ากันหมด tie-break ด้วยเลขโปรเซส", () => {
    const out = simulateSjf([4, 4, 4]);
    expect(out.completionTime).toEqual([4, 8, 12]);
    expect(out.gantt.map((g) => g.processId)).toEqual([1, 2, 3]);
  });

  it("U-S3: BT สลับข้าง เลือกน้อยไปมาก", () => {
    const out = simulateSjf([2, 9, 1]);
    // ลำดับ P3(0–1), P1(1–3), P2(3–12)
    expect(out.completionTime).toEqual([3, 12, 1]);
    expect(out.gantt.map((g) => g.processId)).toEqual([3, 1, 2]);
  });
});

describe("Round Robin", () => {
  it("U-R1: SET-A q=2 ได้ Gantt 9 segments และ CT ตรงค่าคำนวณมือ", () => {
    const out = simulateRr(SET_A, 2);
    expect(out.startTime).toEqual([0, 2, 4]);
    expect(out.completionTime).toEqual([12, 9, 16]);
    expect(out.gantt).toEqual([
      { processId: 1, start: 0, end: 2 },
      { processId: 2, start: 2, end: 4 },
      { processId: 3, start: 4, end: 6 },
      { processId: 1, start: 6, end: 8 },
      { processId: 2, start: 8, end: 9 },
      { processId: 3, start: 9, end: 11 },
      { processId: 1, start: 11, end: 12 },
      { processId: 3, start: 12, end: 14 },
      { processId: 3, start: 14, end: 16 },
    ]);
  });

  it("U-R2: q > ΣBT ทำงานเหมือน FCFS", () => {
    const rr = simulateRr(SET_A, 100);
    const fcfs = simulateFcfs(SET_A);
    expect(rr.completionTime).toEqual(fcfs.completionTime);
    expect(rr.gantt).toEqual(fcfs.gantt);
  });

  it("U-R3: q=1 รันสลับกันทุก 1 หน่วย รวมเวลาเท่า ΣBT", () => {
    const out = simulateRr(SET_A, 1);
    expect(out.gantt).toHaveLength(SET_A_TOTAL_BT);
    const span = out.gantt.reduce((acc, seg) => acc + (seg.end - seg.start), 0);
    expect(span).toBe(SET_A_TOTAL_BT);
    expect(out.gantt.map((g) => g.processId).slice(0, 6)).toEqual([1, 2, 3, 1, 2, 3]);
  });

  it("U-R4: BT = 1 ทุกตัว q=2 เท่า FCFS", () => {
    const rr = simulateRr([1, 1, 1], 2);
    expect(rr.completionTime).toEqual([1, 2, 3]);
  });
});

describe("runSimulation — metrics รวม (SET-A)", () => {
  it("T1: ทั้งสามอัลกอริทึมตรงค่าคำนวณมือทุกช่อง", () => {
    const results = runSimulation({
      processes: SET_A.map((bt, i) => ({ id: i + 1, burstTime: bt })),
      timeQuantum: 2,
      algorithms: ["FCFS", "SJF", "RR"],
    });

    expect(results.map((r) => r.algorithm)).toEqual(["FCFS", "SJF", "RR"]);

    const [fcfs, sjf, rr] = results;

    // FCFS: WT = 0,5,8 | AVG WT = 13/3
    expect(fcfs.processes.map((p) => p.startTime)).toEqual([0, 5, 8]);
    expect(fcfs.processes.map((p) => p.completionTime)).toEqual([5, 8, 16]);
    expect(fcfs.processes.map((p) => p.turnaroundTime)).toEqual([5, 8, 16]);
    expect(fcfs.processes.map((p) => p.waitingTime)).toEqual([0, 5, 8]);
    expect(fcfs.avgWaitingTime).toBe(4.33);
    expect(fcfs.avgTurnaroundTime).toBe(9.67);

    // SJF: ST = 3,0,8 | CT = 8,3,16 | WT = 3,0,8 | AVG WT = 11/3
    expect(sjf.processes.map((p) => p.startTime)).toEqual([3, 0, 8]);
    expect(sjf.processes.map((p) => p.completionTime)).toEqual([8, 3, 16]);
    expect(sjf.processes.map((p) => p.waitingTime)).toEqual([3, 0, 8]);
    expect(sjf.avgWaitingTime).toBe(3.67);
    expect(sjf.avgTurnaroundTime).toBe(9.0);

    // RR q=2: ST = 0,2,4 | CT = 12,9,16 | WT = 7,6,8 | AVG WT = 21/3 = 7.00
    expect(rr.timeQuantum).toBe(2);
    expect(rr.processes.map((p) => p.startTime)).toEqual([0, 2, 4]);
    expect(rr.processes.map((p) => p.completionTime)).toEqual([12, 9, 16]);
    expect(rr.processes.map((p) => p.waitingTime)).toEqual([7, 6, 8]);
    expect(rr.avgWaitingTime).toBe(7.0);
    expect(rr.avgTurnaroundTime).toBe(12.33);

    for (const result of results) expectValidInvariants(result, SET_A);
  });

  it("รองรับเลือกบางอัลกอริทึม", () => {
    const results = runSimulation({
      processes: SET_A.map((bt, i) => ({ id: i + 1, burstTime: bt })),
      timeQuantum: 2,
      algorithms: ["RR"],
    });
    expect(results).toHaveLength(1);
    expect(results[0].algorithm).toBe("RR");
  });

  it("n = 1: ทุกอัลกอริทึมให้ WT = 0", () => {
    const results = runSimulation({
      processes: [{ id: 1, burstTime: 7 }],
      timeQuantum: 2,
      algorithms: ["FCFS", "SJF", "RR"],
    });
    for (const result of results) {
      expect(result.processes[0].waitingTime).toBe(0);
      expect(result.avgWaitingTime).toBe(0);
      expectValidInvariants(result, [7]);
    }
  });
});

function raw(overrides: Partial<RawFormInput> = {}): RawFormInput {
  return {
    processCount: 3,
    burstTimes: ["5", "3", "8"],
    timeQuantum: "2",
    algorithms: { fcfs: true, sjf: true, rr: true },
    ...overrides,
  };
}

describe("validateInput", () => {
  it("U-V9: input ถูกต้องครบ คืน array ว่าง", () => {
    expect(validateInput(raw())).toEqual([]);
  });

  it("U-V1: จำนวนโปรเซสว่าง → E1", () => {
    const issues = validateInput(raw({ processCount: "", burstTimes: [] }));
    expect(issues.map((i) => i.message)).toContain("กรุณากรอกจำนวนโปรเซส");
  });

  it.each([0, -2])("U-V2: จำนวนโปรเซส = %i → E2", (count) => {
    const issues = validateInput(raw({ processCount: count, burstTimes: [] }));
    expect(issues.map((i) => i.message)).toContain("จำนวนโปรเซสต้องเป็นจำนวนเต็มบวก");
  });

  it("U-V3: จำนวนโปรเซส = 11 → E3", () => {
    const issues = validateInput(
      raw({ processCount: 11, burstTimes: Array(11).fill("1") })
    );
    expect(issues.map((i) => i.message)).toContain("จำนวนโปรเซสต้องไม่เกิน 10");
  });

  it("U-V4: BT ว่าง 1 แถว → E4 ระบุ P2", () => {
    const issues = validateInput(raw({ burstTimes: ["5", "", "8"] }));
    expect(issues).toHaveLength(1);
    expect(issues[0].processId).toBe(2);
    expect(issues[0].message).toBe("Burst Time ของ P2 ต้องเป็นจำนวนเต็มบวก");
  });

  it.each([[ "0" ], [ "-1" ], [ "2.5" ], [ "abc" ]])(
    "U-V5: BT = %s → E4 ระบุแถวที่ผิด",
    (bt) => {
      const issues = validateInput(raw({ burstTimes: ["5", bt, "8"] }));
      expect(issues).toHaveLength(1);
      expect(issues[0].field).toBe("burstTime");
      expect(issues[0].processId).toBe(2);
    }
  );

  it("BT ว่าง 1 แถว + อีกแถวกรอกค่าผิด → รายงานครบทั้งสองแถว", () => {
    const issues = validateInput(raw({ burstTimes: ["5", "", "abc"] }));
    const btIssues = issues.filter((i) => i.field === "burstTime");
    expect(btIssues.map((i) => i.processId).sort()).toEqual([2, 3]);
  });

  it("BT ว่างหลายแถว + แถวกรอกค่าผิด → E5 รวม + E4 ระบุแถวผิด", () => {
    const issues = validateInput(raw({ burstTimes: ["", "", "abc"] }));
    const messages = issues.map((i) => i.message);
    expect(messages).toContain("กรุณากรอก Burst Time ให้ครบทุกโปรเซส");
    expect(issues.find((i) => i.processId === 3)?.message).toBe(
      "Burst Time ของ P3 ต้องเป็นจำนวนเต็มบวก"
    );
  });

  it("U-V6: BT ว่างหลายแถว → E5", () => {
    const issues = validateInput(raw({ burstTimes: ["", "", "8"] }));
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toBe("กรุณากรอก Burst Time ให้ครบทุกโปรเซส");
  });

  it.each(["0", "-1", "2.5", "", "abc"])("U-V7: q = %s (เมื่อเลือก RR) → E6", (q) => {
    const issues = validateInput(raw({ timeQuantum: q }));
    expect(issues.map((i) => i.message)).toContain("Time Quantum ต้องเป็นจำนวนเต็มบวก");
  });

  it("q ผิดแต่ไม่เลือก RR → ไม่แจ้ง E6", () => {
    const issues = validateInput(
      raw({ timeQuantum: "0", algorithms: { fcfs: true, sjf: false, rr: false } })
    );
    expect(issues).toEqual([]);
  });

  it("U-V8: ไม่เลือกอัลกอริทึมเลย → E7", () => {
    const issues = validateInput(
      raw({ algorithms: { fcfs: false, sjf: false, rr: false } })
    );
    expect(issues).toHaveLength(1);
    expect(issues[0].field).toBe("algorithm");
  });

  it("ค่าที่มีช่องว่างรอบตัวเลขยังถือว่าถูกต้อง", () => {
    expect(validateInput(raw({ burstTimes: [" 5 ", "3", "8"], timeQuantum: " 2 " }))).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";

import { simulateFcfs } from "../lib/scheduling/fcfs";
import { simulateRr } from "../lib/scheduling/rr";
import { runSimulation } from "../lib/scheduling/simulate";
import { simulateSjf } from "../lib/scheduling/sjf";
import { quantumSweep, stateAt, stepAt, traceSchedule } from "../lib/scheduling/trace";

// SET-A: docs/07-HAND-CALCULATION.md (P1=5, P2=3, P3=8, q=2)
const SET_A = [5, 3, 8];

/** ตัวสุ่มแบบกำหนด seed ได้ — ผล test ทำซ้ำได้ทุกครั้ง */
function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe("traceSchedule — RR ตรงตารางคำนวณมือ docs/07 §7.4 ทีละก้าว", () => {
  const steps = traceSchedule("RR", SET_A, 2);

  it("9 ก้าว ลำดับโปรเซสและช่วงเวลาตรงกับตาราง", () => {
    expect(steps.map((s) => [s.processId, s.start, s.end])).toEqual([
      [1, 0, 2],
      [2, 2, 4],
      [3, 4, 6],
      [1, 6, 8],
      [2, 8, 9],
      [3, 9, 11],
      [1, 11, 12],
      [3, 12, 14],
      [3, 14, 16],
    ]);
  });

  it("remaining หลังรันตรงคอลัมน์ 'remaining หลังรัน'", () => {
    expect(steps.map((s) => s.remainingAfter)).toEqual([3, 1, 6, 1, 0, 4, 0, 2, 0]);
  });

  it("ผลแต่ละก้าว: กลับท้ายคิว / เสร็จ (CT P2 = 9, P1 = 12, P3 = 16)", () => {
    expect(steps.map((s) => s.outcome)).toEqual([
      "preempted",
      "preempted",
      "preempted",
      "preempted",
      "complete",
      "preempted",
      "complete",
      "preempted",
      "complete",
    ]);
    const ct = steps.filter((s) => s.outcome === "complete").map((s) => [s.processId, s.end]);
    expect(ct).toEqual([
      [2, 9],
      [1, 12],
      [3, 16],
    ]);
  });

  it("ลำดับคิว: คิวเริ่ม P1 P2 P3 และตัวที่ถูกพักไปต่อท้าย", () => {
    expect(steps[0].ready).toEqual([1, 2, 3]);
    expect(steps[0].queueAfter).toEqual([2, 3, 1]);
    expect(steps[3].ready).toEqual([1, 2, 3]); // ก้าว 4 ที่ t=6: P1 หัวคิว
    expect(steps[4].ready).toEqual([2, 3, 1]); // ก้าว 5 ที่ t=8: P2 หัวคิว
    expect(steps[4].queueAfter).toEqual([3, 1]); // P2 เสร็จ ไม่กลับเข้าคิว
    expect(steps[8].ready).toEqual([3]); // เหลือ P3 ตัวเดียว
    expect(steps[8].queueAfter).toEqual([]);
  });
});

describe("traceSchedule — FCFS / SJF", () => {
  it("FCFS: ก้าวละโปรเซสตามเลข คิวเหลือตัวที่ยังไม่ได้รัน", () => {
    const steps = traceSchedule("FCFS", SET_A, 2);
    expect(steps.map((s) => s.ready)).toEqual([[1, 2, 3], [2, 3], [3]]);
    expect(steps.every((s) => s.outcome === "complete")).toBe(true);
  });

  it("SJF: คิวเรียง BT น้อย→มาก (P2(3), P1(5), P3(8))", () => {
    const steps = traceSchedule("SJF", SET_A, 2);
    expect(steps.map((s) => s.ready)).toEqual([[2, 1, 3], [1, 3], [3]]);
  });

  it("SJF tie-break ด้วยเลขโปรเซส เหมือน sjf.ts", () => {
    expect(traceSchedule("SJF", [4, 2, 4, 2], 2).map((s) => s.processId)).toEqual([2, 4, 1, 3]);
  });
});

describe("traceSchedule ตรงกับ Gantt ของอัลกอริทึมจริงทุกกรณี (300 ชุดสุ่ม)", () => {
  const rand = lcg(20260930);
  const cases = Array.from({ length: 300 }, () => {
    const n = 1 + Math.floor(rand() * 10);
    return {
      bts: Array.from({ length: n }, () => 1 + Math.floor(rand() * 12)),
      q: 1 + Math.floor(rand() * 6),
    };
  });

  it("start/end/processId ทุกก้าวเท่ากับ gantt segment ทุกอัน", () => {
    for (const { bts, q } of cases) {
      const pairs = [
        [traceSchedule("FCFS", bts, q), simulateFcfs(bts).gantt],
        [traceSchedule("SJF", bts, q), simulateSjf(bts).gantt],
        [traceSchedule("RR", bts, q), simulateRr(bts, q).gantt],
      ] as const;
      for (const [steps, gantt] of pairs) {
        expect(steps.map((s) => ({ processId: s.processId, start: s.start, end: s.end }))).toEqual(
          gantt
        );
      }
    }
  });

  it("เวลาจบของก้าวที่ 'เสร็จ' = CT ของโปรเซสนั้น", () => {
    for (const { bts, q } of cases) {
      const ct = simulateRr(bts, q).completionTime;
      for (const s of traceSchedule("RR", bts, q)) {
        if (s.outcome === "complete") expect(s.end).toBe(ct[s.processId - 1]);
      }
    }
  });
});

describe("stateAt / stepAt", () => {
  const steps = traceSchedule("RR", SET_A, 2);

  it("t=6–7: P1 ใช้ CPU, คิวรอ P2 → P3, ยังไม่มีใครเสร็จ", () => {
    expect(stateAt(steps, 6)).toMatchObject({ running: 1, waiting: [2, 3], done: [] });
  });

  it("t=12–13: P3 ใช้ CPU, P2 และ P1 เสร็จแล้ว", () => {
    expect(stateAt(steps, 12)).toMatchObject({ running: 3, waiting: [], done: [2, 1] });
  });

  it("นอก timeline ไม่มีก้าว", () => {
    expect(stepAt(steps, 16)).toBeNull();
  });
});

describe("quantumSweep", () => {
  const sweep = quantumSweep(SET_A);

  it("q = 1…BT สูงสุด (8 จุด)", () => {
    expect(sweep.map((p) => p.quantum)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("q = 2 ได้ AVG WT 7.00 ตรงกับการคำนวณมือ", () => {
    expect(sweep[1].avgWaitingTime).toBe(7.0);
  });

  it("q ≥ BT สูงสุด → RR เท่ากับ FCFS (4.33)", () => {
    const [fcfs] = runSimulation({
      processes: SET_A.map((bt, i) => ({ id: i + 1, burstTime: bt })),
      timeQuantum: 2,
      algorithms: ["FCFS"],
    });
    expect(sweep[7].avgWaitingTime).toBe(fcfs.avgWaitingTime);
  });
});

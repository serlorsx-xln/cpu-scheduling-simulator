import { describe, expect, it } from "vitest";

import { simulateFcfs } from "../lib/scheduling/fcfs";
import { simulateRr } from "../lib/scheduling/rr";
import { simulateSjf } from "../lib/scheduling/sjf";
import {
  boundaryTicks,
  processAt,
  runIntervals,
  waitIntervals,
  waitingAt,
} from "../lib/scheduling/timeline";

// SET-A: docs/07-HAND-CALCULATION.md (P1=5, P2=3, P3=8, q=2)
const SET_A = [5, 3, 8];

const sum = (xs: { start: number; end: number }[]) =>
  xs.reduce((acc, x) => acc + (x.end - x.start), 0);

describe("processAt", () => {
  it("ใช้ช่วงครึ่งเปิด: ที่ขอบพอดีคือโปรเซสถัดไป", () => {
    const { gantt } = simulateFcfs(SET_A);
    expect(processAt(gantt, 0)).toBe(1);
    expect(processAt(gantt, 4.9)).toBe(1);
    expect(processAt(gantt, 5)).toBe(2);
    expect(processAt(gantt, 15)).toBe(3);
  });

  it("นอก timeline คืน null", () => {
    const { gantt } = simulateFcfs(SET_A);
    expect(processAt(gantt, 16)).toBeNull();
    expect(processAt(gantt, -1)).toBeNull();
  });
});

describe("runIntervals", () => {
  it("RR q=2: ต่อ segment ที่ติดกันของโปรเซสเดียวกัน (P3 12–14, 14–16 → 12–16)", () => {
    const { gantt } = simulateRr(SET_A, 2);
    expect(runIntervals(gantt, 3)).toEqual([
      { start: 4, end: 6 },
      { start: 9, end: 11 },
      { start: 12, end: 16 },
    ]);
  });
});

describe("waitIntervals — ผลรวม = WT ตามค่าคำนวณมือ", () => {
  it("FCFS: WT = 0, 5, 8", () => {
    const { gantt, completionTime } = simulateFcfs(SET_A);
    expect([1, 2, 3].map((id) => sum(waitIntervals(gantt, id, completionTime[id - 1])))).toEqual([
      0, 5, 8,
    ]);
  });

  it("SJF: WT = 3, 0, 8", () => {
    const { gantt, completionTime } = simulateSjf(SET_A);
    expect([1, 2, 3].map((id) => sum(waitIntervals(gantt, id, completionTime[id - 1])))).toEqual([
      3, 0, 8,
    ]);
  });

  it("RR q=2: WT = 7, 6, 8 และช่วงรอของ P1 คือ 2–6, 8–11", () => {
    const { gantt, completionTime } = simulateRr(SET_A, 2);
    expect([1, 2, 3].map((id) => sum(waitIntervals(gantt, id, completionTime[id - 1])))).toEqual([
      7, 6, 8,
    ]);
    expect(waitIntervals(gantt, 1, completionTime[0])).toEqual([
      { start: 2, end: 6 },
      { start: 8, end: 11 },
    ]);
  });
});

describe("waitingAt", () => {
  it("RR q=2 ที่ t=6: P1 ถือ CPU, P2 กับ P3 รอ", () => {
    const { gantt, completionTime } = simulateRr(SET_A, 2);
    expect(processAt(gantt, 6)).toBe(1);
    expect(waitingAt(gantt, completionTime, 6)).toEqual([2, 3]);
  });

  it("โปรเซสที่เสร็จแล้วไม่อยู่ในคิวรอ (FCFS t=10: P1, P2 เสร็จแล้ว)", () => {
    const { gantt, completionTime } = simulateFcfs(SET_A);
    expect(waitingAt(gantt, completionTime, 10)).toEqual([]);
  });
});

describe("boundaryTicks", () => {
  it("ไม่กรอง: ทุกขอบ segment แบบตำราเรียน", () => {
    expect(boundaryTicks(simulateFcfs(SET_A).gantt)).toEqual([0, 5, 8, 16]);
    expect(boundaryTicks(simulateRr(SET_A, 2).gantt)).toEqual([
      0, 2, 4, 6, 8, 9, 11, 12, 14, 16,
    ]);
  });

  it("กรองจุดที่ชิดกันแต่คง 0 และ makespan ไว้เสมอ", () => {
    const ticks = boundaryTicks(simulateRr(SET_A, 2).gantt, 0.1);
    expect(ticks[0]).toBe(0);
    expect(ticks[ticks.length - 1]).toBe(16);
    for (let i = 1; i < ticks.length; i++) {
      expect(ticks[i] - ticks[i - 1]).toBeGreaterThanOrEqual(1.6);
    }
  });

  it("gantt ว่างคืน array ว่าง", () => {
    expect(boundaryTicks([])).toEqual([]);
  });
});

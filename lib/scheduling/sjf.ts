import type { AlgorithmOutput } from "./types";

/** SJF Non-preemptive: เลือก BT น้อยสุดก่อน (เท่ากัน → เลขโปรเซสน้อยก่อน) */
export function simulateSjf(burstTimes: number[]): AlgorithmOutput {
  // AT = 0 ทุกโปรเซส จึงเรียงลำดับครั้งเดียวแล้วรันแบบ FCFS บนลำดับใหม่ได้ผลเดียวกัน
  const order = burstTimes
    .map((bt, i) => ({ bt, i }))
    .sort((a, b) => a.bt - b.bt || a.i - b.i);

  const startTime: number[] = new Array(burstTimes.length);
  const completionTime: number[] = new Array(burstTimes.length);
  const gantt: AlgorithmOutput["gantt"] = [];

  let t = 0;
  for (const { bt, i } of order) {
    startTime[i] = t;
    completionTime[i] = t + bt;
    gantt.push({ processId: i + 1, start: t, end: completionTime[i] });
    t = completionTime[i];
  }

  return { startTime, completionTime, gantt };
}

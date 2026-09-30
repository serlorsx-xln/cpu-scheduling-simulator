import type { AlgorithmOutput } from "./types";

/** FCFS: รันตามลำดับเข้าระบบ P1 → Pn */
export function simulateFcfs(burstTimes: number[]): AlgorithmOutput {
  const startTime: number[] = [];
  const completionTime: number[] = [];
  const gantt: AlgorithmOutput["gantt"] = [];

  let t = 0;
  for (let i = 0; i < burstTimes.length; i++) {
    startTime[i] = t;
    completionTime[i] = t + burstTimes[i];
    gantt.push({ processId: i + 1, start: t, end: completionTime[i] });
    t = completionTime[i];
  }

  return { startTime, completionTime, gantt };
}

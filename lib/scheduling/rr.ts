import type { AlgorithmOutput } from "./types";

/** RR: คิววนตามลำดับ P1→Pn รันได้ไม่เกิน quantum หน่วยต่อครั้ง ไม่จบกลับท้ายคิว */
export function simulateRr(burstTimes: number[], quantum: number): AlgorithmOutput {
  const startTime: number[] = new Array(burstTimes.length).fill(-1);
  const completionTime: number[] = new Array(burstTimes.length);
  const gantt: AlgorithmOutput["gantt"] = [];

  const remaining = [...burstTimes];
  const queue = burstTimes.map((_, i) => i);

  let t = 0;
  while (queue.length > 0) {
    const i = queue.shift() as number;
    const runTime = Math.min(quantum, remaining[i]);

    if (startTime[i] === -1) startTime[i] = t;
    gantt.push({ processId: i + 1, start: t, end: t + runTime });
    t += runTime;
    remaining[i] -= runTime;

    if (remaining[i] === 0) completionTime[i] = t;
    else queue.push(i);
  }

  return { startTime, completionTime, gantt };
}

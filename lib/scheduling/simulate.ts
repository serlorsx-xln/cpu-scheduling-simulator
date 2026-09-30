import { simulateFcfs } from "./fcfs";
import { simulateRr } from "./rr";
import { simulateSjf } from "./sjf";
import type {
  AlgorithmName,
  AlgorithmOutput,
  ProcessResult,
  SimulationInput,
  SimulationResult,
} from "./types";

/** ปัดเป็นทศนิยม 2 ตำแหน่ง เพื่อให้ค่าที่แสดงและค่าที่ทดสอบเป็นตัวเดียวกัน */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** คำนวณ TAT/WT/AVG จากผลดิบ — สูตรของโจทย์ทำที่จุดเดียว (AT = 0 → TAT = CT) */
function finalize(
  algorithm: AlgorithmName,
  burstTimes: number[],
  output: AlgorithmOutput,
  timeQuantum?: number
): SimulationResult {
  const processes: ProcessResult[] = burstTimes.map((bt, i) => {
    const turnaroundTime = output.completionTime[i]; // CT - AT, AT = 0
    return {
      id: i + 1,
      burstTime: bt,
      startTime: output.startTime[i],
      completionTime: output.completionTime[i],
      turnaroundTime,
      waitingTime: turnaroundTime - bt,
    };
  });

  const n = burstTimes.length;
  const sumTat = processes.reduce((acc, p) => acc + p.turnaroundTime, 0);
  const sumWt = processes.reduce((acc, p) => acc + p.waitingTime, 0);

  return {
    algorithm,
    ...(timeQuantum !== undefined ? { timeQuantum } : {}),
    processes,
    avgWaitingTime: round2(sumWt / n),
    avgTurnaroundTime: round2(sumTat / n),
    gantt: output.gantt,
  };
}

const allAlgorithms: AlgorithmName[] = ["FCFS", "SJF", "RR"];

/** เรียกอัลกอริทึมตามที่ผู้ใช้เลือก ด้วยชุดข้อมูลเดียวกัน เรียงผล FCFS, SJF, RR เสมอ */
export function runSimulation(input: SimulationInput): SimulationResult[] {
  const bt = input.processes.map((p) => p.burstTime);
  const results: SimulationResult[] = [];

  for (const algorithm of allAlgorithms) {
    if (!input.algorithms.includes(algorithm)) continue;
    switch (algorithm) {
      case "FCFS":
        results.push(finalize("FCFS", bt, simulateFcfs(bt)));
        break;
      case "SJF":
        results.push(finalize("SJF", bt, simulateSjf(bt)));
        break;
      case "RR":
        results.push(finalize("RR", bt, simulateRr(bt, input.timeQuantum), input.timeQuantum));
        break;
    }
  }

  return results;
}

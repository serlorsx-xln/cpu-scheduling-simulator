import type { GanttSegment } from "./types";

/** ช่วงเวลาครึ่งเปิด [start, end) */
export interface Interval {
  start: number
  end: number
}

/**
 * โปรเซสที่ถือ CPU อยู่ ณ เวลา t (ใช้ช่วงครึ่งเปิด [start, end) — ที่ขอบพอดีนับเป็นโปรเซสถัดไป)
 * คืน null เมื่อ t อยู่นอก timeline
 */
export function processAt(gantt: GanttSegment[], t: number): number | null {
  const seg = gantt.find((s) => t >= s.start && t < s.end);
  return seg ? seg.processId : null;
}

/** ช่วงที่โปรเซสได้ CPU (ต่อ segment ที่ติดกันของโปรเซสเดียวกันให้เป็นช่วงเดียว) */
export function runIntervals(gantt: GanttSegment[], processId: number): Interval[] {
  const out: Interval[] = [];
  for (const seg of gantt) {
    if (seg.processId !== processId) continue;
    const last = out[out.length - 1];
    if (last && last.end === seg.start) last.end = seg.end;
    else out.push({ start: seg.start, end: seg.end });
  }
  return out;
}

/**
 * ช่วงที่โปรเซสอยู่ในระบบแต่ไม่ได้ CPU (AT = 0 → นับตั้งแต่ 0 ถึง CT)
 * ผลรวมความยาวของช่วงเหล่านี้ = WT ของโปรเซสนั้น
 */
export function waitIntervals(
  gantt: GanttSegment[],
  processId: number,
  completionTime: number
): Interval[] {
  const out: Interval[] = [];
  let cursor = 0;
  for (const run of runIntervals(gantt, processId)) {
    if (run.start > cursor) out.push({ start: cursor, end: run.start });
    cursor = run.end;
  }
  if (completionTime > cursor) out.push({ start: cursor, end: completionTime });
  return out;
}

/** โปรเซสที่รอ CPU อยู่ ณ เวลา t (มาถึงแล้ว ยังไม่เสร็จ และไม่ได้ถือ CPU) เรียงตามเลขโปรเซส */
export function waitingAt(
  gantt: GanttSegment[],
  completionTimes: number[],
  t: number
): number[] {
  const running = processAt(gantt, t);
  return completionTimes
    .map((ct, i) => ({ id: i + 1, ct }))
    .filter(({ id, ct }) => id !== running && t < ct)
    .map(({ id }) => id);
}

/**
 * จุดเวลาที่ควรพิมพ์บนแกน Gantt แบบตำราเรียน: ทุกขอบ segment
 * แต่ข้ามจุดที่ชิดจุดก่อนหน้าเกิน minGapRatio ของ makespan (กันตัวเลขชนกัน)
 * จุดแรก (0) และจุดสุดท้าย (makespan) คงไว้เสมอ
 */
export function boundaryTicks(gantt: GanttSegment[], minGapRatio = 0): number[] {
  if (gantt.length === 0) return [];
  const total = gantt[gantt.length - 1].end;
  const all = [0, ...gantt.map((s) => s.end)];
  const unique = [...new Set(all)].sort((a, b) => a - b);
  const minGap = total * minGapRatio;

  const kept: number[] = [];
  for (const t of unique) {
    const prev = kept[kept.length - 1];
    if (prev === undefined || t - prev >= minGap) kept.push(t);
  }
  // บังคับให้มี makespan เสมอ — ถ้าจุดก่อนหน้าชิดเกินไป ให้แทนที่จุดนั้น
  if (kept[kept.length - 1] !== total) {
    if (kept.length > 1 && total - kept[kept.length - 1] < minGap) kept.pop();
    kept.push(total);
  }
  return kept;
}

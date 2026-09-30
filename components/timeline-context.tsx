"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * สถานะ interaction ที่แชร์ข้ามทุกกราฟของผลลัพธ์ชุดเดียวกัน
 * - focus: โปรเซสที่ถูกชี้ (hover) หรือปักไว้ (click) — ทุกกราฟ/ตารางเน้นโปรเซสนี้
 * - cursor: หน่วยเวลาที่เคอร์เซอร์เวลาชี้อยู่ (ช่วง [cursor, cursor+1)) — ทุก Gantt แสดงเส้นตรงกัน
 */
interface TimelineState {
  focus: number | null
  pinned: number | null
  setHover: (id: number | null) => void
  togglePin: (id: number) => void
  cursor: number | null
  setCursor: (t: number | null) => void
  /** makespan — เท่ากันทุกอัลกอริทึม (= ΣBT) จึงใช้สเกลเวลาเดียวกันได้ */
  total: number
}

const TimelineContext = createContext<TimelineState | null>(null);

export function TimelineProvider({ total, children }: { total: number; children: ReactNode }) {
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [cursor, setCursor] = useState<number | null>(null);

  const value = useMemo<TimelineState>(
    () => ({
      focus: hover ?? pinned,
      pinned,
      setHover,
      togglePin: (id) => setPinned((p) => (p === id ? null : id)),
      cursor,
      setCursor,
      total,
    }),
    [hover, pinned, cursor, total]
  );

  return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>;
}

export function useTimeline(): TimelineState {
  const ctx = useContext(TimelineContext);
  if (!ctx) throw new Error("useTimeline must be used inside <TimelineProvider>");
  return ctx;
}

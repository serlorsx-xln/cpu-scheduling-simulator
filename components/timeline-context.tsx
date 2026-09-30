"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const PLAYBACK_SPEEDS = [0.5, 1, 2, 4] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

/** เวลาต่อหนึ่งหน่วยที่ความเร็ว 1× — ช้าพอให้อ่านคิวทันขณะนำเสนอ */
const BASE_TICK_MS = 900;

/**
 * สถานะ interaction ที่แชร์ข้ามทุกกราฟของผลลัพธ์ชุดเดียวกัน
 * - focus: โปรเซสที่ถูกชี้ (hover) หรือปักไว้ (click) — ทุกกราฟ/ตารางเน้นโปรเซสนี้
 * - cursor: หน่วยเวลา [cursor, cursor+1) ที่แสดงอยู่ = เวลาที่เมาส์ชี้ชั่วคราว ถ้าไม่มีใช้เวลาที่ถือไว้
 *   เวลาที่ถือไว้ (held) มาจากการเล่นอัตโนมัติ แถบเลื่อน ปุ่มก้าว หรือปุ่มลูกศรบนไทม์ไลน์
 */
interface TimelineState {
  focus: number | null
  pinned: number | null
  setHover: (id: number | null) => void
  togglePin: (id: number) => void

  cursor: number | null
  held: number | null
  setHeld: (t: number | null) => void
  setHoverCursor: (t: number | null) => void

  playing: boolean
  speed: PlaybackSpeed
  setSpeed: (s: PlaybackSpeed) => void
  play: () => void
  pause: () => void
  stepBy: (delta: number) => void

  /** makespan — เท่ากันทุกอัลกอริทึม (= ΣBT) จึงใช้สเกลเวลาเดียวกันได้ */
  total: number
}

const TimelineContext = createContext<TimelineState | null>(null);

export function TimelineProvider({ total, children }: { total: number; children: ReactNode }) {
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [held, setHeldRaw] = useState<number | null>(null);
  const [hoverCursor, setHoverCursor] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);

  const last = total - 1;
  const clamp = useCallback((t: number) => Math.min(last, Math.max(0, t)), [last]);

  const setHeld = useCallback(
    (t: number | null) => setHeldRaw(t === null ? null : clamp(t)),
    [clamp]
  );

  const play = useCallback(() => {
    // เล่นจบแล้วหรือยังไม่เริ่ม → เริ่มจาก 0 ใหม่
    setHeldRaw((h) => (h === null || h >= last ? 0 : h));
    setHoverCursor(null);
    setPlaying(true);
  }, [last]);

  const pause = useCallback(() => setPlaying(false), []);

  const stepBy = useCallback(
    (delta: number) => {
      setPlaying(false);
      setHeldRaw((h) => clamp((h ?? (delta > 0 ? -1 : total)) + delta));
    },
    [clamp, total]
  );

  // ตัวเดินเวลา: เดินทีละหน่วย หยุดเองเมื่อถึงหน่วยสุดท้าย
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setHeldRaw((h) => {
        const next = (h ?? -1) + 1;
        if (next >= last) setPlaying(false);
        return Math.min(next, last);
      });
    }, BASE_TICK_MS / speed);
    return () => window.clearInterval(id);
  }, [playing, speed, last]);

  const value = useMemo<TimelineState>(
    () => ({
      focus: hover ?? pinned,
      pinned,
      setHover,
      togglePin: (id) => setPinned((p) => (p === id ? null : id)),
      cursor: playing ? held : (hoverCursor ?? held),
      held,
      setHeld,
      setHoverCursor,
      playing,
      speed,
      setSpeed,
      play,
      pause,
      stepBy,
      total,
    }),
    [hover, pinned, hoverCursor, held, setHeld, playing, speed, play, pause, stepBy, total]
  );

  return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>;
}

export function useTimeline(): TimelineState {
  const ctx = useContext(TimelineContext);
  if (!ctx) throw new Error("useTimeline must be used inside <TimelineProvider>");
  return ctx;
}

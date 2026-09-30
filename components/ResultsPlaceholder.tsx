"use client";

import { FlaskConical, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/** รูปร่างของ Gantt ตัวอย่าง (ภาพประกอบเท่านั้น ไม่ใช่ผลคำนวณ) — ความกว้างเป็นหน่วยเวลา */
const GHOST_STRIP = [2, 2, 2, 2, 1, 2, 1, 2, 2];
const GHOST_LANES = [
  { runs: [[0, 2], [6, 8], [11, 12]], ct: 12 },
  { runs: [[2, 4], [8, 9]], ct: 9 },
  { runs: [[4, 6], [9, 11], [12, 16]], ct: 16 },
] as const;
const TOTAL = 16;

/**
 * Empty state ที่สอนการใช้งาน: บอกว่าจะได้อะไร + ภาพโครงกราฟจริง + ทางเริ่มสองทาง
 */
export default function ResultsPlaceholder({
  onCalculate,
  onLoadSample,
}: {
  onCalculate: () => void
  onLoadSample: () => void
}) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardContent className="px-0">
        <div className="px-5 pt-6 pb-5 sm:px-8 sm:pt-8">
          <h2 className="text-lg font-bold text-foreground">ยังไม่มีผลลัพธ์</h2>
          <p className="mt-1.5 max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
            กดคำนวณเพื่อรันทุกอัลกอริทึมที่เลือกกับชุดข้อมูลเดียวกัน แต่ละอัลกอริทึมจะได้ Gantt
            Chart ที่มีเลขเวลาทุกขอบ, แถวแสดงช่วงได้ CPU และช่วงรอของแต่ละโปรเซส และตาราง
            Process · BT · ST · CT · TAT · WT พร้อม AVG WT
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="button" onClick={onCalculate}>
              <Play aria-hidden />
              คำนวณด้วยค่าปัจจุบัน
            </Button>
            <Button type="button" variant="outline" onClick={onLoadSample}>
              <FlaskConical aria-hidden />
              ลองชุดตัวอย่าง SET-A
            </Button>
          </div>
          <p className="mt-3 text-xs text-subtle">
            SET-A: P1 = 5, P2 = 3, P3 = 8, q = 2 — ชุดเดียวกับการคำนวณมือในเอกสารโปรเจกต์
          </p>
        </div>

        {/* ภาพโครงผลลัพธ์ — decoration ล้วน */}
        <div aria-hidden className="border-t bg-surface-2/40 px-5 py-6 sm:px-8">
          <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-x-3 gap-y-1.5 opacity-70">
            <span className="font-mono text-xs text-subtle">CPU</span>
            <div className="flex h-9 gap-[2px]">
              {GHOST_STRIP.map((w, i) => (
                <div
                  key={i}
                  className="h-full rounded-[4px] bg-segment"
                  style={{ width: `${(w / TOTAL) * 100}%` }}
                />
              ))}
            </div>
            <span />
            <div className="mb-2 h-px bg-border" />
            {GHOST_LANES.map((lane, i) => (
              <div key={i} className="contents">
                <span className="font-mono text-xs text-subtle">P{i + 1}</span>
                <div className="relative h-3.5">
                  <div
                    className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-[2px] bg-foreground/[0.08]"
                    style={{ width: `${(lane.ct / TOTAL) * 100}%` }}
                  />
                  {lane.runs.map(([s, e]) => (
                    <div
                      key={s}
                      className="absolute inset-y-0 rounded-[3px] bg-foreground/20"
                      style={{ left: `${(s / TOTAL) * 100}%`, width: `${((e - s) / TOTAL) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 pl-[3rem] text-xs text-subtle">ตัวอย่างโครงกราฟ — ค่าจริงจะแสดงหลังคำนวณ</p>
        </div>
      </CardContent>
    </Card>
  );
}

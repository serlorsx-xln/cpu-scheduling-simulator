"use client";

import { Command, CornerDownLeft, FlaskConical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

/** โลโก้: Gantt ย่อส่วน 3 แถว — วาดเป็น SVG เอง ขนาดไอคอน */
function Mark() {
  return (
    <svg viewBox="0 0 20 20" className="size-6 shrink-0" aria-hidden>
      <rect width="20" height="20" rx="5" className="fill-foreground" />
      <rect x="4" y="5" width="6" height="2.4" rx="1" className="fill-background" />
      <rect x="10.8" y="8.8" width="5.2" height="2.4" rx="1" className="fill-background" />
      <rect x="7" y="12.6" width="5.6" height="2.4" rx="1" className="fill-background opacity-55" />
    </svg>
  );
}

/** แถบบนสุดของแอป — ชื่อผลิตภัณฑ์เป็น h1, ขวา: ปุ่มลัดคำนวณ + โหลดชุดตัวอย่าง */
export default function AppHeader({
  onLoadSample,
  isMac,
}: {
  onLoadSample: () => void
  /** แสดงปุ่มลัดให้ตรงระบบ (⌘ บน Mac, Ctrl ที่อื่น) */
  isMac: boolean
}) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Mark />
          <h1 className="truncate text-[15px] font-bold text-foreground">CPU Scheduling Simulator</h1>
          <span className="hidden h-4 w-px bg-border md:block" aria-hidden />
          <p className="hidden truncate text-sm text-muted-foreground md:block">
            เปรียบเทียบ FCFS · SJF · Round Robin ด้วยชุดข้อมูลเดียวกัน
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <p className="hidden items-center gap-2 text-xs text-muted-foreground lg:flex">
            <KbdGroup>
              <Kbd>{isMac ? <Command aria-label="Command" /> : "Ctrl"}</Kbd>
              <Kbd>
                <CornerDownLeft aria-label="Enter" />
              </Kbd>
            </KbdGroup>
            คำนวณ
          </p>
          <Button type="button" variant="outline" size="sm" onClick={onLoadSample}>
            <FlaskConical aria-hidden />
            <span className="hidden sm:inline">ชุดตัวอย่าง</span> SET-A
          </Button>
        </div>
      </div>
    </header>
  );
}

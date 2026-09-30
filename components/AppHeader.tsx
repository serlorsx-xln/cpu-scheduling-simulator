"use client";

import { Command, CornerDownLeft, FlaskConical, Minimize2, Presentation, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

/** แถบบนสุดของแอป — ชื่อผลิตภัณฑ์เป็น h1; ขวา: ปุ่มลัด · พิมพ์ · โหมดนำเสนอ · ชุดตัวอย่าง */
export default function AppHeader({
  onLoadSample,
  isMac,
  presenting,
  onTogglePresent,
  onPrint,
  canPrint,
}: {
  onLoadSample: () => void
  /** แสดงปุ่มลัดให้ตรงระบบ (⌘ บน Mac, Ctrl ที่อื่น) */
  isMac: boolean
  presenting: boolean
  onTogglePresent: () => void
  onPrint: () => void
  /** พิมพ์ได้เมื่อมีผลลัพธ์แล้ว */
  canPrint: boolean
}) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background print:hidden">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-3 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Mark />
          <h1 className="truncate text-[15px] font-bold text-foreground">CPU Scheduling Simulator</h1>
          <span className="hidden h-4 w-px bg-border xl:block" aria-hidden />
          <p className="hidden truncate text-sm text-muted-foreground xl:block">
            เปรียบเทียบ FCFS · SJF · Round Robin ด้วยชุดข้อมูลเดียวกัน
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <p className={`mr-2 hidden items-center gap-2 text-xs text-muted-foreground ${presenting ? "" : "lg:flex"}`}>
            <KbdGroup>
              <Kbd>{isMac ? <Command aria-label="Command" /> : "Ctrl"}</Kbd>
              <Kbd>
                <CornerDownLeft aria-label="Enter" />
              </Kbd>
            </KbdGroup>
            คำนวณ
          </p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onPrint}
                disabled={!canPrint}
                aria-label="พิมพ์หรือบันทึกเป็น PDF"
                className="hidden text-muted-foreground sm:inline-flex"
              >
                <Printer aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{canPrint ? "พิมพ์ / บันทึก PDF สำหรับแนบรายงาน" : "คำนวณก่อนจึงพิมพ์ได้"}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={presenting ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={onTogglePresent}
                aria-pressed={presenting}
                aria-label={presenting ? "ออกจากโหมดนำเสนอ" : "โหมดนำเสนอ"}
                className={presenting ? undefined : "text-muted-foreground"}
              >
                {presenting ? <Minimize2 aria-hidden /> : <Presentation aria-hidden />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {presenting ? "ออกจากโหมดนำเสนอ" : "โหมดนำเสนอ — ตัวใหญ่ เต็มจอ ซ่อนแผงตั้งค่า"}
            </TooltipContent>
          </Tooltip>
          <Button type="button" variant="outline" size="sm" onClick={onLoadSample} className="ml-1.5">
            <FlaskConical aria-hidden />
            <span className="hidden sm:inline">ชุดตัวอย่าง</span> SET-A
          </Button>
        </div>
      </div>
    </header>
  );
}

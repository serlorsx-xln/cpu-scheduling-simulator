"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

import { PLAYBACK_SPEEDS, useTimeline, type PlaybackSpeed } from "./timeline-context";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function IconButton({
  label,
  onClick,
  disabled,
  children,
  variant = "ghost",
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  variant?: "ghost" | "default"
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant={variant}
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          className={variant === "ghost" ? "text-muted-foreground" : undefined}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/**
 * ตัวควบคุมการจำลองแบบเวลาเดิน — ขับ "เวลาที่ถือไว้" ร่วมกันทุกอัลกอริทึม
 * ติดด้านบนคอลัมน์ผลลัพธ์ขณะเลื่อนดูการ์ด
 */
export default function PlaybackBar() {
  const { held, setHeld, playing, play, pause, stepBy, speed, setSpeed, total } = useTimeline();
  const atEnd = held !== null && held >= total - 1;

  return (
    <div className="sticky top-14 z-20 -mt-3 bg-background pt-3 print:hidden">
    <div
      role="toolbar"
      aria-label="ควบคุมการจำลองตามเวลา"
      className="flex items-center gap-x-2 rounded-xl border bg-card px-2 py-2 sm:gap-x-4 sm:px-4 sm:py-2.5"
    >
      <div className="flex items-center gap-1">
        <IconButton
          label={playing ? "หยุดชั่วคราว" : atEnd ? "เล่นใหม่ตั้งแต่ต้น" : "เล่นการจำลอง"}
          onClick={playing ? pause : play}
          variant="default"
        >
          {playing ? <Pause aria-hidden /> : atEnd ? <RotateCcw aria-hidden /> : <Play aria-hidden />}
        </IconButton>
        <IconButton label="ถอยหนึ่งหน่วยเวลา" onClick={() => stepBy(-1)} disabled={held === 0}>
          <SkipBack aria-hidden />
        </IconButton>
        <IconButton label="ไปหนึ่งหน่วยเวลา" onClick={() => stepBy(1)} disabled={atEnd}>
          <SkipForward aria-hidden />
        </IconButton>
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <Slider
          min={0}
          max={Math.max(0, total - 1)}
          step={1}
          value={[held ?? 0]}
          onValueChange={([v]) => {
            pause();
            setHeld(v);
          }}
          aria-label="เลื่อนเวลา"
          aria-valuetext={held === null ? "ยังไม่เริ่ม" : `ช่วงเวลา ${held} ถึง ${held + 1} จาก ${total}`}
          className="flex-1"
        />
        <p className="w-[4.5rem] shrink-0 text-right text-xs text-muted-foreground sm:w-[5.5rem]" aria-live="off">
          {held === null ? (
            "ยังไม่เริ่ม"
          ) : (
            <>
              <span className="font-mono tabular text-foreground">
                {held}–{held + 1}
              </span>{" "}
              / <span className="font-mono tabular">{total}</span>
            </>
          )}
        </p>
      </div>

      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        spacing={0}
        value={String(speed)}
        onValueChange={(v) => v && setSpeed(Number(v) as PlaybackSpeed)}
        aria-label="ความเร็วในการเล่น"
        className="hidden sm:flex"
      >
        {PLAYBACK_SPEEDS.map((s) => (
          <ToggleGroupItem key={s} value={String(s)} className="w-10 text-xs">
            {s}×
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          setSpeed(PLAYBACK_SPEEDS[(PLAYBACK_SPEEDS.indexOf(speed) + 1) % PLAYBACK_SPEEDS.length])
        }
        aria-label={`ความเร็ว ${speed} เท่า — แตะเพื่อเปลี่ยน`}
        className="w-11 shrink-0 text-xs sm:hidden"
      >
        {speed}×
      </Button>
    </div>
    </div>
  );
}

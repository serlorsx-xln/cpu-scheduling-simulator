# 9. UI Validation Messages, Styling และ Accessibility

> กฎ validation ทั้งหมดอยู่ที่ [02-REQUIREMENTS §2.5](02-REQUIREMENTS.md) — ไฟล์นี้คือสเปกการแสดงผล

## 9.1 Message Catalog

| รหัส | เงื่อนไข | ข้อความ |
|---|---|---|
| E1 | จำนวนโปรเซสว่าง | กรุณากรอกจำนวนโปรเซส |
| E2 | จำนวนโปรเซส ≤ 0 หรือไม่ใช่จำนวนเต็ม | จำนวนโปรเซสต้องเป็นจำนวนเต็มบวก |
| E3 | จำนวนโปรเซส > 10 | จำนวนโปรเซสต้องไม่เกิน 10 |
| E4 | BT แถวใดว่างหรือไม่ใช่จำนวนเต็มบวก | Burst Time ของ P{k} ต้องเป็นจำนวนเต็มบวก |
| E5 | BT ว่างหลายแถว | กรุณากรอก Burst Time ให้ครบทุกโปรเซส |
| E6 | q ≤ 0 / ไม่ใช่จำนวนเต็ม / ว่าง (เมื่อเลือก RR) | Time Quantum ต้องเป็นจำนวนเต็มบวก |
| E7 | ไม่เลือกอัลกอริทึมใดเลย | กรุณาเลือกอัลกอริทึมอย่างน้อย 1 แบบ |

กฎการแสดง:
- E4 แสดงซ้ำต่อแถวที่ค่าไม่ถูกต้อง (0, -1, 2.5); ถ้าว่างหลายแถวใช้ E5 แทน
- แสดงทั้ง inline ใต้ช่องที่ผิด (ขอบแดง + จุดสถานะแดงในตาราง BT) และรวมเป็น bullet ในกล่อง ErrorSummary
- มี error = ผลลัพธ์เดิมถูกล้าง ไม่แสดงผลจากข้อมูลที่ผิด
- **ไม่ใช้ `alert()`**

## 9.2 Design System (ธีม shadcn/ui premium dark)

| ส่วน | ค่า |
|---|---|
| UI framework | **shadcn/ui 100%** (style radix-nova): Card, Button, Input, Label, Table, Badge, Separator, Tabs, Checkbox, Tooltip |
| ฟอนต์ UI | **LINE Seed Sans TH** self-host woff2 (SIL OFL 1.1) ผ่าน `next/font/local` — Regular 400 / Bold 700 |
| ฟอนต์ตัวเลข | IBM Plex Mono (next/font/google) + `tabular` (font-variant-numeric) ในตาราง/AVG/q/legend |
| สีทั้งหมด | shadcn design tokens (oklch): `--background` oklch(0.145 0.005 286), `--card` oklch(0.185...), `--border` ขาว 10% — ความลึกจาก border + พื้น 3 ระดับ ไม่มี glow/gradient ประดับ |
| ปุ่มหลัก | shadcn Button default (`--primary` oklch(0.922 0 0) พื้นสว่าง ตัวอักษรเข้ม) |
| รูปทรง | คมแบบแม่นยำ: จุดสี `rounded-[3px]`, แท่ง `rounded-sm`, ไม่มี pill `rounded-full` ใน UI |
| สีอัลกอริทึม | ศูนย์กลางที่ `components/algorithm-styles.ts`: FCFS sky, SJF emerald, RR amber (dot/bar/softBg/ring/text/border) — ใช้ร่วมทั้งฟอร์ม การ์ด แผงเปรียบเทียบ legend |
| สีโปรเซสใน Gantt | palette 8 สีโทน 400 วนตาม id (`processBarColor`) ตัวอักษรบนแท่งเป็น `text-primary-foreground` |
| Animation | `animate-fade-up` (fade + translateY 8px, 0.4s) ไล่ delay 70ms ต่อการ์ด — ปิดทั้งหมดเมื่อ `prefers-reduced-motion: reduce` |
| Responsive | grid `lg:grid-cols-[400px_minmax(0,1fr)]`, ฟอร์ม sticky `top-8` + `max-h-[calc(100svh-4rem)] overflow-y-auto`, ตารางหุ้ม `overflow-x-auto` ในตัว shadcn Table |
| Spinner input เลข | ซ่อน (`appearance: textfield`) — กรอกเอง/ใช้ stepper หรือปุ่มลัด |
| Metadata | openGraph + viewport themeColor ใน `app/layout.tsx` |

## 9.3 Accessibility และ UX

- ทุก input มี `<label>`/aria-label ผูกถูกต้อง ("จำนวนโปรเซส (1–10)", "P{k} Burst Time", "Time Quantum")
- checkbox ของการ์ดอัลกอริทึมเป็น `sr-only` แต่ยังเป็น role checkbox จริง คีย์บอร์ดใช้ได้
- ปุ่ม stepper มี aria-label แยก ("เพิ่ม/ลด Time Quantum")
- กด Enter ในฟอร์ม = คำนวณ (`form onSubmit` → handleCalculate)
- Error ชัดเจนด้วยตัวหนังสือ ไม่ใช้แค่สี; กล่อง error มี `role="alert"`
- คำนวณสำเร็จ → `scrollIntoView` ไปยังผลลัพธ์อย่างนุ่มนวล

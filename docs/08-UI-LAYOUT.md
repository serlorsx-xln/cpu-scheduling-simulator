# 8. UI Layout และพฤติกรรมหน้าจอ (ธีม shadcn/ui premium dark)

> ข้อความ error / styling / a11y อยู่ที่ [09-UI-VALIDATION-UX](09-UI-VALIDATION-UX.md) · กฎ validation ที่ [02-REQUIREMENTS §2.5](02-REQUIREMENTS.md)

## 8.1 แนวคิดการออกแบบ

ธีม **premium dark** บน shadcn/ui (style radix-nova) ทั้งระบบ — สะอาด อ่านง่าย เหมือน production จริง ไม่ใช่ console/glassmorphism:

- สีทั้งหมดผ่าน **design tokens ของ shadcn** (oklch): พื้น `--background` neutral อุ่น oklch(0.145 0.005 286) การ์ด `--card` สว่างกว่าพื้นหนึ่งระดับ ความลึกมาจาก border hairline (`--border` ขาว 10%) และพื้น 3 ระดับ ไม่ใช้ glow/gradient ประดับ
- **shadcn/ui 100%**: Card, Button, Input, Label, Table, Badge, Separator, Tabs, Checkbox, Tooltip — ไม่มี UI primitive ที่เขียนเองนอก data-viz
- ฟอนต์: **LINE Seed Sans TH** (self-host woff2, SIL OFL 1.1, ผ่าน `next/font/local`) สำหรับข้อความไทย/อังกฤษ + **IBM Plex Mono** สำหรับตัวเลขทุกตัว (`tabular-nums`)
- รูปทรงคมแบบแม่นยำ: จุดสี `rounded-[3px]`, แท่ง bar `rounded-sm`, ไม่มี pill `rounded-full` ใน UI
- สีอัลกอริทึม: FCFS sky / SJF emerald / RR amber (แหล่งเดียวที่ `components/algorithm-styles.ts`) ใช้ร่วมทั้งฟอร์ม การ์ด แผงเปรียบเทียบ legend
- `prefers-reduced-motion` ปิด animation ทั้งหมด

## 8.2 ภาพรวม Layout

หน้าเดียวแบบ dashboard 2 คอลัมน์ (container `max-w-6xl`):

```
┌──────────────────────────────────────────────────────────────┐
│ [Badge: Operating Systems · Term Project]                    │
│ จำลองการจัดคิวงานของ CPU (h1 3xl/4xl bold)                    │
│ คำอธิบาย + ป้าย "ทุกโปรเซสมี Arrival Time = 0"                │
├───────────────┬──────────────────────────────────────────────┤
│ คอลัมน์ซ้าย    │ คอลัมน์ขวา (ผลลัพธ์)                          │
│ (400px sticky │ ┌ ⚠ ErrorSummary (เมื่อ validation ไม่ผ่าน) ┐  │
│  top-8        │ ┌ แผงเปรียบเทียบ AVG WT (≥2 อัลกอริทึม) ──┐  │
│  overflow-y   │ │  FCFS  ████████░░ 4.33                  │  │
│  -auto)       │ │  SJF   ██████░░░ 3.67 [ต่ำสุด]          │  │
│ ┌ Card ฟอร์ม: │ │  RR    █████████ 7.00 (q=2)            │  │
│ │ ① จำนวน    │ └────────────────────────────────────────┘  │
│ │ ② BT       │ ┌ การ์ดผลลัพธ์ FCFS (fade-up ไล่ delay) ────┐  │
│ │ ③ อัลกอริทึม│ │ ตาราง · AVG WT/TAT · Gantt + legend    │  │
│ │ + quantum  │ └────────────────────────────────────────┘  │
│ │ คำนวณ/ล้าง  │ ┌ การ์ด SJF ┐ ┌ การ์ด RR (q=2) ┐            │
│ └───────────┘ │ (ยังไม่คำนวณ → ghost preview placeholder)   │
├───────────────┴──────────────────────────────────────────────┤
│ footer: CPU Scheduling Simulator — Operating Systems          │
└──────────────────────────────────────────────────────────────┘
```

- จอ ≥ lg: ฟอร์มซ้าย `sticky top-8` + `max-h-[calc(100svh-4rem)] overflow-y-auto` (ฟอร์มยาวกรณี 10 โปรเซสเลื่อนภายในได้ ไม่ทะลุจอ)
- จอเล็ก: คอลัมน์ซ้อนกัน (ฟอร์มบน ผลลัพธ์ล่าง)
- ยังไม่คำนวณ: คอลัมน์ขวาเป็น **ghost preview** — แผงเปรียบเทียบ + ตาราง (แท่งแทนตัวเลข) + Gantt จำลอง ที่ opacity ต่ำ `aria-hidden` + sr-only คำอธิบายจริง

## 8.3 พฤติกรรมฟอร์ม (Card เดียว 3 สเต็ป)

หัวข้อแต่ละสเต็ป: เลขลำดับในสี่เหลี่ยม `rounded-[5px]` + ชื่อหัวข้อ

**① จำนวนโปรเซส** — Input เลข mono กลางช่อง + ปุ่ม shadcn ลัด 3 / 5 / 10 (ตัวที่เลือกอยู่ = variant secondary) เปลี่ยนค่า/สร้างแถว P1…Pn ทันที คงค่า BT เดิมตาม index; **โหมดสุ่ม: แถวใหม่สุ่มค่าให้อัตโนมัติ** (ช่อง readonly จะว่างแก้ไม่ได้)

**② Burst Time** — shadcn **Tabs** 2 แท็บ (สุ่มอัตโนมัติ / กรอกเอง) + ปุ่ม "สุ่มใหม่" (ghost + ไอคอน Dices + Tooltip) วาง**นอก** TabsList เป็น sibling — ไม่หลอกว่าเป็นแท็บที่สาม
- โหมดสุ่ม: ช่อง readonly แสดงค่าที่ใช้คำนวณจริง
- ตาราง BT ใช้ shadcn Table primitives เดียวกับตารางผลลัพธ์: จุดสถานะ `rounded-[2px]` (เทา = ปกติ แดง = ผิด) แถวผิดมี inline error

**③ อัลกอริทึม** — การ์ดเลือก 3 ใบ (shadcn **Checkbox** + label ทั้งใบคลิกได้):
- เลือกแล้ว: พื้นสีอ่อนประจำอัลกอริทึม (10%) + border สี + จุดสีสว่าง + ไอคอน **Check** (lucide) สีประจำ
- ยังไม่เลือก: ขอบ `border-border` จุดจาง 25%
- เลือก RR → กล่อง Time Quantum: stepper ปุ่ม − / + (ghost) ปรับทีละ 1 ขั้นต่ำ 1, default 2, focus ring ที่ wrapper

**ปุ่ม** — "คำนวณผลลัพธ์" shadcn Button เต็มความกว้าง, "ล้างค่า" ghost + ไอคอน RotateCcw
- กด Enter = คำนวณ (`type="submit"` + `noValidate` เพื่อให้ custom validation E1–E7 ทำงานเสมอ)
- ล้างค่า: reset ทุก state (n=3, โหมดสุ่ม, ทุกอัลกอริทึม, q=2)

## 8.4 พฤติกรรมผลลัพธ์

- **ErrorSummary**: กล่อง `role="alert"` ขอบ destructive/30 + ไอคอน AlertTriangle + bullet ทุกข้อ ผลลัพธ์เดิมถูกล้าง
- **แผงเปรียบเทียบ AVG WT** (≥2 อัลกอริทึม): ราง `bg-muted` + แท่งสีประจำอัลกอริทึม กว้าง ∝ AVG WT เทียบค่าแย่สุด (สเกลเริ่ม 0 ตรงไปตรงมา) — แท่งที่ดีสุด opacity 1 ที่เหลือ 0.5 + Badge "ต่ำสุด" ขอบ emerald + `role="img"` พร้อม aria-label ค่าจริง
- **การ์ดผลลัพธ์ต่ออัลกอริทึม** (fade-up ไล่ delay 70ms): CardHeader จุดสี + ชื่อเต็ม + Badge `q = k` (RR) → ตาราง (shadcn Table) → stat block AVG WT / AVG TAT (mono 2xl) → Gantt
- ตารางเรียง P1…Pn เสมอ, ตัวเลข mono tabular ชิดขวา, คอลัมน์ WT หนาสุด
- **Gantt chart ละเอียด**: legend แมปสี↔โปรเซส + makespan บนสุด, แท่งกว้าง ∝ ระยะเวลา (วางต่อเนื่อง margin -1px ไม่ใช้ gap เพื่อความแม่นของสเกล), เส้น grid แนวตั้ง `foreground/20` ทุกช่วง "หารสวย" (1/2/4/5/10×n...≤9 เส้น), แกนเวลา 0–total, label ในแท่งเมื่อกว้างพอ (≥8%), hover/focus ขยายแท่ง + **Tooltip** `P1 · ช่วง 0–5 · ยาว 5 หน่วย` (เข้าถึงด้วย keyboard ได้ tabIndex=0)

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

## 9.2 Design System (สรุป — ฉบับเต็มที่ [DESIGN.md](../DESIGN.md))

| ส่วน | ค่า |
|---|---|
| UI primitives | shadcn/ui (radix-nova): Card, Button, Input, Table, Badge, Tabs, ToggleGroup, Checkbox, Tooltip, Kbd — Badge ปรับมุมเป็น 5px (ไม่มีทรงเม็ดยา) |
| ฟอนต์ | **LINE Seed Sans TH** (self-host woff2, SIL OFL 1.1) สำหรับข้อความและตัวเลขขนาดใหญ่ · **Geist Mono** เฉพาะตัวเลขที่ต้องเรียงคอลัมน์ (ตาราง แกนเวลา สูตร) เพราะ LINE Seed ไม่มี tabular figures |
| พื้น | 3 ระดับ: หน้า `#0c0d0f` → การ์ด `#131417` → `#1a1b1f` / `#232429`; เส้นขอบ hairline ขาว 8%; ไม่มี gradient/glass/เงาประดับ |
| ข้อความ | foreground `#ededef` (15.8:1 บนการ์ด) · muted `#9d9da6` (6.9:1) · subtle `#868690` (5.1:1) · destructive `#f07070` (6.4:1) |
| สีข้อมูล | FCFS `#3987e5` · SJF `#199e70` · RR `#d95926` — ผ่าน palette validator ทั้ง all-pairs และตาบอดสีบน `#131417`; ใช้กับ mark เท่านั้น ข้อความไม่ใช้สีข้อมูล |
| Gantt | segment กลาง `#2c2d33` · โปรเซสที่โฟกัสยกเป็นสีสว่าง (emphasis) แทนการวนสี 10 สี |
| ปุ่มหลัก | shadcn Button default (พื้นสว่าง ตัวอักษรเข้ม) |
| มุม | 3–10px ตามขนาด ไม่มี pill |
| Motion | transition 150–240ms, wipe เปิดไทม์ไลน์หนึ่งครั้งหลังคำนวณ, การ์ด rise 240ms — ปิดทั้งหมดเมื่อ `prefers-reduced-motion` |
| พื้นผิวเบราว์เซอร์ | สี selection, caret, scrollbar, focus ring ตั้งจาก token; spinner ของ input number ซ่อน (ใช้ stepper) |

## 9.3 Accessibility และ UX

- ทุก input มี label ผูกจริง: "จำนวนโปรเซส (1–10)", "P{k} Burst Time", "Time Quantum"; ช่องที่ผิดมี `aria-invalid` + `aria-describedby` ชี้ข้อความ error
- Checkbox อัลกอริทึมเป็น shadcn Checkbox (Radix) กดได้ทั้งแถว คีย์บอร์ดใช้ได้; stepper มี aria-label "เพิ่ม/ลด…"
- Enter ในฟอร์ม และ ⌘/Ctrl+Enter ทั้งหน้า = คำนวณ (`noValidate` เพื่อให้ validation E1–E7 ของเราทำงานเสมอ)
- กล่อง error `role="alert"` แต่ละข้อเป็นปุ่มพาไปโฟกัสช่องที่ต้องแก้; error สื่อด้วยข้อความ ไม่ใช่สีอย่างเดียว
- ไทม์ไลน์เป็น `role="group"` โฟกัสได้ ใช้ ←/→/Home/End/Esc เลื่อนเคอร์เซอร์เวลา สถานะอ่านผ่าน `aria-live`
- ทุกค่าบนกราฟอ่านได้จากตารางหรือข้อความด้วย (tooltip/hover ไม่ใช่ทางเดียว)
- จอเล็ก: คำนวณแล้วเลื่อนไปผลลัพธ์อัตโนมัติ; แถบปุ่มคำนวณล่างจอเป็น `inert` เมื่อถูกซ่อน

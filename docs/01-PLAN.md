# 1. แผนหลักของโปรเจกต์

> เอกสารอื่น: [README](README.md) · ความต้องการ: [02-REQUIREMENTS](02-REQUIREMENTS.md) · สถาปัตยกรรม: [03-ARCHITECTURE](03-ARCHITECTURE.md)

## 1.1 ภาพรวม

| รายการ | รายละเอียด |
|---|---|
| รูปแบบ | Web Application ด้วย **Next.js 15 (App Router)** |
| เทคโนโลยี | Next.js 15 + React 19 + TypeScript (strict) + Tailwind CSS |
| การรัน | `npm install` → `npm run dev` → เปิด http://localhost:3000 |
| การประมวลผล | ฝั่ง Client ทั้งหมด — ไม่มี API / ฐานข้อมูล |
| อัลกอริทึม | FCFS, SJF (Non-preemptive), RR (q ปรับได้, default 2) |
| การทดสอบ | Vitest (unit) + ทดสอบบนเบราว์เซอร์ T1–T4 |

### เหตุผลที่เลือก Next.js
- โจทย์เปิดให้เลือกเครื่องมือได้ เงื่อนไขคือเปิดและทดสอบได้ไม่ซับซ้อน — แก้ด้วย README 2 คำสั่ง
- TypeScript ตรวจ type ของตรรกะอัลกอริทึม (หัวใจของความถูกต้อง) ตอน compile
- โครงสร้างมาตรฐาน ต่อยอดได้ (เพิ่ม API / หน้าเปรียบเทียบเฉพาะอัลกอริทึมภายหลัง)

## 1.2 เทคโนโลยีประกอบ

| ส่วน | เครื่องมือ |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript, Tailwind, ESLint จาก create-next-app) |
| ภาษา | TypeScript strict |
| Styling | Tailwind CSS |
| Unit test | Vitest |

## 1.3 ขอบเขตที่ตั้งใจตัดออก

- `app/api/` — ไม่มี endpoint (คำนวณบน client ทั้งหมด)
- State library (Redux/Zustand) — state ของหน้าเดียวใช้ `useState` พอ
- ฐานข้อมูล / env variables — ไม่จำเป็น

## 1.4 ขั้นตอนการพัฒนา

1. **Init โปรเจกต์** — `npx create-next-app@latest` (TypeScript + Tailwind + App Router)
2. **lib/scheduling/** — เขียน types → FCFS → SJF → RR ทีละตัว พร้อม Vitest เทียบค่าคำนวณมือ ([07-HAND-CALCULATION](07-HAND-CALCULATION.md)) ให้ผ่านก่อนแตะ UI
3. **lib/validation.ts** — เขียน validation ครบตาม [02-REQUIREMENTS §5](02-REQUIREMENTS.md) พร้อม unit test
4. **Components** — SchedulingForm → ProcessTableInput → ResultTable → GanttChart → ResultCard → ErrorSummary
5. **หน้า page.tsx** — ประกอบ state และ components, เชื่อมปุ่มคำนวณ → validate → simulate → render
6. **Styling** — Tailwind ตามแนวทาง [09-UI-VALIDATION-UX](09-UI-VALIDATION-UX.md)
7. **ทดสอบรวม** — รัน T1–T4 บนเบราว์เซอร์ + `npm run test` บันทึกภาพผลลัพธ์
8. **เตรียมส่ง** — README วิธีรัน, สื่อประกอบการนำเสนอ

## 1.5 เกณฑ์เสร็จสมบูรณ์ (Definition of Done)

- [ ] `npm install && npm run dev` แล้วเปิด http://localhost:3000 ใช้งานได้ทันที
- [ ] กรอกจำนวนโปรเซส → สร้าง P1…Pn อัตโนมัติ (AT = 0)
- [ ] กำหนด BT ได้ทั้งแบบสุ่มและกรอกเอง
- [ ] เลือก FCFS/SJF/RR ได้, แก้ Time Quantum ได้ (default 2)
- [ ] ตาราง Process/BT/ST/CT/TAT/WT + AVG WT ครบทุกอัลกอริทึมที่เลือก ด้วยชุดข้อมูลเดียว
- [ ] Validation ครบทุกกรณี แจ้งเตือนชัดเจน ไม่คำนวณเมื่อ input ผิด
- [ ] Gantt chart สอดคล้องกับตาราง
- [ ] Unit test (Vitest) ผ่านทั้งหมด — รวมค่าคำนวณมือ
- [ ] README มีวิธีเปิดและทดสอบโปรแกรมชัดเจน

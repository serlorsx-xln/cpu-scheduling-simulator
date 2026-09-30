# CPU Scheduling Simulator

โปรแกรมจำลองและเปรียบเทียบอัลกอริทึม CPU Scheduling: **FCFS**, **SJF (Non-preemptive)** และ **Round Robin**
พัฒนาด้วย Next.js (App Router) + TypeScript + Tailwind CSS v4 + **shadcn/ui** + **LINE Seed Sans TH** (self-host) ในธีม dark แบบ premium

> เอกสารโปรเจกต์ทั้งหมด (แผน, สถาปัตยกรรม, สเปกอัลกอริทึม, การคำนวณมือ, แผนทดสอบ) อยู่ที่ [docs/README.md](docs/README.md)

## วิธีเปิดใช้งาน

ต้องมี [Node.js](https://nodejs.org) ติดตั้งไว้ก่อน แล้วรัน 2 คำสั่ง:

```bash
npm install
npm run dev
```

จากนั้นเปิดเบราว์เซอร์ที่ **http://localhost:3000**

## วิธีใช้งานโปรแกรม

1. กรอก **จำนวนโปรเซส** (1–10) หรือกดปุ่มลัด 3 / 5 / 10 — ระบบสร้าง P1…Pn ให้อัตโนมัติ (ทุกโปรเซสมี Arrival Time = 0)
2. เลือกวิธีกำหนด **Burst Time**: สุ่มอัตโนมัติ (กด "สุ่มใหม่" ได้) หรือกรอกเอง
3. เลือกอัลกอริทึมที่ต้องการเปรียบเทียบ (FCFS / SJF / Round Robin เลือกได้หลายแบบ) ถ้าเลือก Round Robin กำหนด **Time Quantum** ได้ (ค่าเริ่มต้น 2)
4. กด **คำนวณผลลัพธ์** (หรือ ⌘/Ctrl + Enter) → ได้
   - แผงเปรียบเทียบ AVG WT และ Waiting Time รายโปรเซสของทุกอัลกอริทึม
   - การ์ดต่ออัลกอริทึม: Gantt Chart (มีเลขเวลาทุกขอบ), แถวแสดงช่วงได้ CPU/ช่วงรอของแต่ละโปรเซส, ตาราง Process / BT / ST / CT / TAT / WT และสูตร AVG WT
5. ชี้หรือใช้ปุ่มลูกศรบน Gantt เพื่อดูว่าแต่ละหน่วยเวลาใครได้ CPU ใครรอ (ทุกอัลกอริทึมพร้อมกัน) · ชี้/คลิกโปรเซสเพื่อไฮไลต์โปรเซสนั้นในทุกกราฟ
6. ปุ่ม **SET-A** โหลดชุดตัวอย่างจากการคำนวณมือ (P1=5, P2=3, P3=8, q=2) แล้วคำนวณทันที

## วิธีรัน unit test

```bash
npm run test
```

ทดสอบตรรกะอัลกอริทึม, validation และตัวช่วยวิเคราะห์ไทม์ไลน์ (`lib/scheduling/timeline.ts`) ด้วย Vitest รวมถึงการเทียบกับค่าคำนวณมือ (SET-A: P1=5, P2=3, P3=8) — รายละเอียดใน [docs/10-UNIT-TESTS.md](docs/10-UNIT-TESTS.md)

## โครงสร้างโปรเจกต์

```
app/            หน้าเว็บหลัก (App Router) + ฟอนต์ LINE Seed Sans TH (self-host woff2)
components/     UI components (ฟอร์ม, ตารางผลลัพธ์, Gantt chart, error, ghost preview)
components/ui/  shadcn/ui primitives (Card, Button, Table, Tabs, Tooltip, ...)
lib/scheduling/ ตรรกะอัลกอริทึม FCFS/SJF/RR (pure functions)
lib/validation.ts  การตรวจสอบข้อมูลฟอร์ม
tests/          unit tests (Vitest)
docs/           เอกสารโปรเจกต์
```

# เอกสารโปรเจกต์ — CPU Scheduling Simulator

Term Project: จำลองและเปรียบเทียบอัลกอริทึม CPU Scheduling — **FCFS**, **SJF (Non-preemptive)**, **Round Robin**
พัฒนาด้วย **Next.js 15 (App Router) + TypeScript + Tailwind CSS** คำนวณทั้งหมดบน client

## ดัชนีเอกสาร (เรียงตามลำดับที่ควรอ่าน)

| # | ไฟล์ | เนื้อหา |
|---|---|---|
| 1 | [01-PLAN.md](01-PLAN.md) | แผนหลัก: ภาพรวม เทคโนโลยี ขั้นตอนพัฒนา เกณฑ์เสร็จสมบูรณ์ |
| 2 | [02-REQUIREMENTS.md](02-REQUIREMENTS.md) | ความต้องการเชิงหน้าที่ 1.1–1.5 ของโจทย์ และกฎ validation ทั้งหมด |
| 3 | [03-ARCHITECTURE.md](03-ARCHITECTURE.md) | สถาปัตยกรรมโปรเจกต์ โครงสร้างไฟล์ state และ data flow |
| 4 | [04-DATA-MODEL.md](04-DATA-MODEL.md) | TypeScript interfaces และ signature ของฟังก์ชันหลัก |
| 5 | [05-DESIGN-DECISIONS.md](05-DESIGN-DECISIONS.md) | เหตุผลเชิงออกแบบของการตัดสินใจแต่ละจุด |
| 6 | [06-ALGORITHMS.md](06-ALGORITHMS.md) | ตรรกะ + pseudocode ของ FCFS, SJF, RR และสูตร metrics |
| 7 | [07-HAND-CALCULATION.md](07-HAND-CALCULATION.md) | ชุดข้อมูลอ้างอิง + การคำนวณด้วยมือทีละขั้น (ใช้ยืนยันความถูกต้อง) |
| 8 | [08-UI-LAYOUT.md](08-UI-LAYOUT.md) | Wireframe และพฤติกรรมของหน้าจอแต่ละโซน |
| 9 | [09-UI-VALIDATION-UX.md](09-UI-VALIDATION-UX.md) | ข้อความแจ้งเตือนมาตรฐาน แนวทาง styling และ accessibility |
| 10 | [10-UNIT-TESTS.md](10-UNIT-TESTS.md) | เคส unit test (Vitest) ทั้งหมด |
| 11 | [11-MANUAL-TESTS.md](11-MANUAL-TESTS.md) | การทดสอบบนเบราว์เซอร์ T1–T4 ตามโจทย์ข้อ 1.6 และเกณฑ์ผ่าน |
| 12 | [12-CODE-EXPLAINER.md](12-CODE-EXPLAINER.md) | คู่มืออธิบายโค้ดสำหรับคนอัดวิดีโอ (เขียนให้คนไม่เคยเขียนโค้ด) — ปูพื้นภาษาโค้ด, 6 หัวข้อที่โจทย์กำหนด, โค้ดจริงพร้อมแปลทีละบรรทัด, ภาพหน้าจอ, สคริปต์ถ่ายทีละฉาก |

## อ่านแบบย่อตามบทบาท

- **เตรียมนำเสนอ / ส่งงาน** → อ่าน 01, 02, 07 (การตรวจสอบด้วยมือ) และ 11
- **เริ่มเขียนโค้ด** → อ่าน 03, 04, 06 ก่อน แล้วใช้ 08, 09 เป็นสเปก UI และ 10 เป็นเป้าหมายการทดสอบ
- **ตรวจสอบการออกแบบ** → 05 รวมเหตุผลทั้งหมดไว้ที่เดียว

## เงื่อนไขสำคัญของโจทย์ (สรุปสั้น)

- ทุกโปรเซสมี **Arrival Time = 0** เรียงลำดับ P1 → Pn
- กำหนด BT ได้ 2 วิธี: สุ่มอัตโนมัติ หรือกรอกเอง
- Round Robin ปรับ Time Quantum ได้ (ค่าเริ่มต้น 2)
- ต้องแสดงตาราง Process / BT / ST / CT / TAT / WT + **AVG WT** ของแต่ละอัลกอริทึมด้วยชุดข้อมูลเดียวกัน
- ตรวจสอบข้อมูลทุกช่อง และทดสอบอย่างน้อย 3 กรณี พร้อมยืนยันด้วยการคำนวณมือ 1 กรณี

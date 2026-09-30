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

## 9.2 Design System

| ส่วน | ค่า |
|---|---|
| ฟอนต์ UI | IBM Plex Sans Thai (next/font, subsets thai+latin, 300–700) ผ่าน `--font-sans` |
| ฟอนต์ตัวเลข | IBM Plex Mono ผ่าน `--font-mono` + `tabular` (font-variant-numeric) ในตาราง/AVG/q |
| พื้นหลังหน้า | gradient เรืองแสงจางสองฟ้า-ส้มบนพื้น slate-100 (`globals.css`) |
| การ์ด | `rounded-2xl border border-slate-200/80 bg-white shadow-sm` |
| ปุ่มหลัก | พื้น slate-900 ตัวอักษรขาว hover slate-700 active scale 0.99 |
| สีอัลกอริทึม | ศูนย์กลางที่ `components/algorithm-styles.ts`: FCFS น้ำเงิน, SJF เขียว, RR ส้ม (dot/bar/softBg/ring) — ใช้ร่วมทั้งฟอร์ม การ์ด แผงเปรียบเทียบ |
| สีโปรเซสใน Gantt | palette 8 สีวนตาม id (`processBarColor`) |
| Animation | `animate-fade-up` (fade + translateY, 0.45s) ใช้กับ ErrorSummary / แผงเปรียบเทียบ / การ์ดผลลัพธ์ (ไล่ delay 70ms ต่อใบ) |
| Responsive | grid `lg:grid-cols-[400px_1fr]`, ฟอร์ม sticky บน lg, ตารางหุ้ม `overflow-x-auto` |

## 9.3 Accessibility และ UX

- ทุก input มี `<label>`/aria-label ผูกถูกต้อง ("จำนวนโปรเซส (1–10)", "P{k} Burst Time", "Time Quantum")
- checkbox ของการ์ดอัลกอริทึมเป็น `sr-only` แต่ยังเป็น role checkbox จริง คีย์บอร์ดใช้ได้
- ปุ่ม stepper มี aria-label แยก ("เพิ่ม/ลด Time Quantum")
- กด Enter ในฟอร์ม = คำนวณ (`form onSubmit` → handleCalculate)
- Error ชัดเจนด้วยตัวหนังสือ ไม่ใช้แค่สี; กล่อง error มี `role="alert"`
- คำนวณสำเร็จ → `scrollIntoView` ไปยังผลลัพธ์อย่างนุ่มนวล

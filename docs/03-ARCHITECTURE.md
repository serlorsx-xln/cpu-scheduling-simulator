# 3. สถาปัตยกรรมโปรเจกต์

> Types และ signature: [04-DATA-MODEL](04-DATA-MODEL.md) · เหตุผลการออกแบบ: [05-DESIGN-DECISIONS](05-DESIGN-DECISIONS.md)

## 3.1 ภาพรวม Layer

ระบบเป็น Next.js App Router แบบ single-page interaction — ทำงานฝั่ง client ทั้งหมด ไม่มี backend/ฐานข้อมูล ตรรกะอัลกอริทึมถูกแยกจาก React อย่างสมบูรณ์เพื่อทดสอบด้วย unit test โดยตรง

```
┌─────────────────────────────────────────────────────┐
│ UI Layer (React Client Components)                  │
│  app/page.tsx  ← state กลางของหน้า                  │
│    ├─ SchedulingForm      (รับ input)               │
│    ├─ ErrorSummary        (แสดง error)              │
│    └─ ResultCard[]        (แสดงผลต่ออัลกอริทึม)      │
│         ├─ ResultTable                              │
│         └─ GanttChart                               │
├─────────────────────────────────────────────────────┤
│ Application Logic (plain TypeScript, ไม่รู้จัก React)│
│  lib/validation.ts   — input → ValidationIssue[]    │
│  lib/scheduling/     — input → SimulationResult[]   │
└─────────────────────────────────────────────────────┘
                    ▲
                    │ unit test (Vitest)
              tests/scheduling.test.ts
```

**หลักการสำคัญ**: ข้อมูลไหลทางเดียว — UI รวบรวม input → `validate()` → ถ้าผ่าน `runSimulation()` → render ผลลัพธ์ ตรรกะทั้งสองส่วนเป็น pure function (input เดิม → ผลเดิม ไม่มี side effect)

## 3.2 โครงสร้างไฟล์

```
CPU-Scheduling-Simulator/
├── app/
│   ├── layout.tsx              # Root layout: <html lang="th">, metadata ชื่อโปรเจกต์
│   ├── page.tsx                # หน้าเดียวของแอป ("use client") — เก็บ state, ประกอบ components
│   └── globals.css             # Tailwind
├── components/
│   ├── SchedulingForm.tsx      # จำนวนโปรเซส, โหมด BT, checkboxes อัลกอริทึม, q, ปุ่มคำนวณ/ล้างค่า
│   ├── ProcessTableInput.tsx   # ตารางแถว P1…Pn + ช่อง BT
│   ├── ResultCard.tsx          # การ์ด 1 อัลกอริทึม: หัวข้อ + ResultTable + GanttChart + AVG WT
│   ├── ResultTable.tsx         # ตาราง Process | BT | ST | CT | TAT | WT
│   ├── GanttChart.tsx          # วาดแถบจาก GanttSegment[] (กว้าง ∝ ความยาว segment)
│   └── ErrorSummary.tsx        # กล่องรวมข้อความ error + highlight ช่องที่ผิด
├── lib/
│   ├── scheduling/
│   │   ├── types.ts            # ProcessInput, GanttSegment, SimulationResult, ...
│   │   ├── fcfs.ts             # simulateFcfs(burstTimes)
│   │   ├── sjf.ts              # simulateSjf(burstTimes)
│   │   ├── rr.ts               # simulateRr(burstTimes, quantum)
│   │   └── simulate.ts         # runSimulation(input) → SimulationResult[]
│   └── validation.ts           # validateInput(raw) → ValidationIssue[]
├── tests/
│   └── scheduling.test.ts      # Vitest: ค่าคำนวณมือ + กรณีขอบ
├── docs/                       # เอกสารชุดนี้
├── package.json / tsconfig.json / next.config.ts
└── README.md                   # วิธีติดตั้ง/รัน/ทดสอบ
```

## 3.3 State ของหน้า (page.tsx)

ใช้ `useState` ล้วน ไม่ต้องมี state library:

| State | ชนิด | หน้าที่ |
|---|---|---|
| `processCount` | number | จำนวนโปรเซส (1–10) |
| `btMode` | `"random" \| "manual"` | โหมดกำหนด BT |
| `burstTimes` | `number[]` | ค่า BT ของแต่ละโปรเซส |
| `selectedAlgorithms` | `{ fcfs, sjf, rr }` | อัลกอริทึมที่เลือก |
| `timeQuantum` | number | ค่า q ของ RR (default 2) |
| `results` | `SimulationResult[] \| null` | ผลลัพธ์หลังกดคำนวณ |
| `errors` | `ValidationIssue[]` | ข้อผิดพลาดจาก validation |

## 3.4 Data Flow ของการกด "คำนวณ" หนึ่งครั้ง

```
กดคำนวณ
  → รวม raw input จาก state (processCount, burstTimes[], q, algorithms)
  → validateInput(raw)
      ├─ มี error → setErrors(issues), setResults(null)   (จบ — ไม่คำนวณ)
      └─ ผ่าน    → runSimulation(input)
                    → SimulationResult[] (1 ชิ้นต่ออัลกอริทึมที่เลือก)
                    → setResults(...), setErrors([])
  → render: ResultCard ต่ออัลกอริทึม (ตาราง + Gantt + AVG WT)
```

- การสุ่ม BT ทำใน UI layer เมื่อกดปุ่มสุ่ม/เปลี่ยนโหมด — `lib/scheduling` **ไม่มีความสุ่มใด ๆ** (deterministic) เพื่อให้ test ได้
- สลับโหมด BT ไม่ลบค่าที่กรอกไว้; เปลี่ยนจำนวนโปรเซสคงค่า BT เดิมตาม index ที่ยังอยู่

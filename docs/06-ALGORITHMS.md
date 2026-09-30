# 6. ตรรกะอัลกอริทึม (Algorithms Specification)

> ตัวอย่างคำนวณจริงทีละขั้นอยู่ที่ [07-HAND-CALCULATION](07-HAND-CALCULATION.md) · สเปก UI ที่ [08-UI-LAYOUT](08-UI-LAYOUT.md)

## 6.0 เงื่อนไขร่วม

- ทุกโปรเซส **Arrival Time = 0** เข้าระบบตามลำดับ P1 → Pn ระบบเริ่มที่ t = 0
- นิยาม: **ST** = เวลาที่โปรเซสได้ CPU *ครั้งแรก*, **CT** = เวลาที่ทำงานเสร็จสมบูรณ์
- ทุกอัลกอริทึมบันทึก Gantt segment `{processId, start, end}` ขณะรัน

## 6.1 FCFS (First-Come, First-Served)

รันตามลำดับเข้าระบบ ไม่มีการเลือกลำดับใดเพิ่มเติม

```
t ← 0
for each process p in P1..Pn:
    ST[p] ← t
    CT[p] ← t + BT[p]
    t ← CT[p]
    gantt.push(p, ST[p], CT[p])
```

## 6.2 SJF — Shortest Job First (Non-preemptive)

เลือกโปรเซสที่มี BT น้อยที่สุดก่อน รันจนจบโดยไม่ถูกแทรก

```
order ← sort P1..Pn ด้วย key (BT asc, id asc)   // tie → เลขโปรเซสน้อยก่อน
t ← 0
for each p in order:
    ST[p] ← t
    CT[p] ← t + BT[p]
    t ← CT[p]
```

> เหตุผลที่ใช้ sort แทนการเลือกทีละรอบ: เมื่อ AT = 0 ทุกโปรเซสพร้อมตั้งแต่ต้น ผลเหมือนกันทุกประการ แต่โค้ดสั้นและ deterministic (ดู [05-DESIGN-DECISIONS #5](05-DESIGN-DECISIONS.md))

## 6.3 Round Robin (RR)

จัดคิววน รันได้ไม่เกิน q หน่วยต่อครั้ง

```
queue ← [P1, P2, ..., Pn]
remaining[p] ← BT[p] ; ST[p] ← undefined
t ← 0
while queue not empty:
    p ← queue.dequeue()
    runTime ← min(quantum, remaining[p])
    if ST[p] undefined: ST[p] ← t          // ได้ CPU ครั้งแรก
    gantt.push(p, t, t + runTime)
    t ← t + runTime
    remaining[p] ← remaining[p] - runTime
    if remaining[p] = 0: CT[p] ← t
    else: queue.enqueue(p)                  // กลับท้ายคิว
```

> เนื่องจาก AT = 0 ทุกตัว ไม่มีโปรเซสใหม่มาแทรกระหว่างทาง กฎ "โปรเซสที่ถูก preempt กลับท้ายคิวหลังโปรเซสมาใหม่" จึงไม่มีผล — ใช้คิววนธรรมดา (ดู [05-DESIGN-DECISIONS #6](05-DESIGN-DECISIONS.md))

## 6.4 การคำนวณ Metrics ร่วม (ที่ `simulate.ts`)

หลังอัลกอริทึมคืน ST/CT ของแต่ละโปรเซส:

```
TAT[p]  = CT[p] − AT[p] = CT[p]        (เพราะ AT = 0)
WT[p]   = TAT[p] − BT[p]
AVG WT  = Σ WT[p] ÷ n     (แสดงทศนิยม 2 ตำแหน่ง)
AVG TAT = Σ TAT[p] ÷ n    (ค่าเสริมเพื่อการเปรียบเทียบ)
```

## 6.5 Invariant ตรวจสอบความถูกต้อง (ต้องจริงทุกครั้ง ทุกอัลกอริทึม)

1. ผลรวมความยาว Gantt segments = Σ BT (CPU ไม่ว่าง ไม่ overwork)
2. Gantt ต่อเนื่อง — segment เริ่มที่เวลาเดียวกับที่ segment ก่อนจบ
3. ทุกโปรเซส ST ≤ CT และ WT ≥ 0
4. TAT = CT (เพราะ AT = 0) และ WT = TAT − BT ทุกโปรเซส

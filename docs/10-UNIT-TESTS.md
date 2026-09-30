# 10. Unit Tests (Vitest) — `tests/scheduling.test.ts`

> ค่าอ้างอิงจากการคำนวณมือ: [07-HAND-CALCULATION](07-HAND-CALCULATION.md) · การทดสอบบนเบราว์เซอร์: [11-MANUAL-TESTS](11-MANUAL-TESTS.md)
> รันด้วย `npm run test` — เขียนเป็นตาราง (`test.each`) ให้ครบทุกแถว

## 10.1 ชุดข้อมูลมาตรฐาน

**SET-A**: BT ของ P1 = 5, P2 = 3, P3 = 8 (AT = 0, q = 2) — ค่า expected ดู §7.5 ของเอกสารคำนวณมือ

## 10.2 FCFS

| ID | กรณี | Input | Expected |
|---|---|---|---|
| U-F1 | SET-A | [5,3,8] | ST = [0,5,8], CT = [5,8,16], WT = [0,5,8], AVG WT = 4.33 |
| U-F2 | โปรเซสเดียว | [7] | ST = [0], CT = [7], WT = [0] |
| U-F3 | BT = 1 ทุกตัว | [1,1,1] | ลำดับ P1,P2,P3 — CT = [1,2,3] |

## 10.3 SJF (Non-preemptive)

| ID | กรณี | Input | Expected |
|---|---|---|---|
| U-S1 | SET-A | [5,3,8] | ลำดับ P2,P1,P3 — CT = [8,3,16], AVG WT = 3.67 |
| U-S2 | BT เท่ากันหมด (tie-break) | [4,4,4] | ลำดับ P1,P2,P3 — CT = [4,8,12] |
| U-S3 | BT สลับข้าง | [2,9,1] | ลำดับ P3,P1,P2 — CT = [3,5,14] |

## 10.4 Round Robin

| ID | กรณี | Input | Expected |
|---|---|---|---|
| U-R1 | SET-A, q=2 | [5,3,8], q=2 | Gantt 9 segments ตามตารางวนคิว §7.4, CT = [12,9,16], AVG WT = 7.00 |
| U-R2 | q > ΣBT (เท่า FCFS) | [5,3,8], q=100 | ลำดับและค่าทุกอย่างเท่า FCFS |
| U-R3 | q = 1 | [5,3,8], q=1 | โปรเซสสลับกันทุก 1 หน่วย, ΣBT = 16 ยังจริง |
| U-R4 | BT = 1 ทุกตัว, q=2 | [1,1,1], q=2 | เท่า FCFS — CT = [1,2,3] |

## 10.5 Metrics และ Invariant (ตรวจร่วมกับทุกเคสข้างบน)

| ID | Invariant | วิธีตรวจ |
|---|---|---|
| U-I1 | TAT = CT (เพราะ AT = 0) | เทียบทุกโปรเซสทุกเคส |
| U-I2 | WT = TAT − BT | เทียบทุกโปรเซสทุกเคส |
| U-I3 | Σ ความยาว Gantt = Σ BT | ทุกเคส |
| U-I4 | Gantt ต่อเนื่อง (end ของ segment = start ของถัดไป) | ทุกเคส |
| U-I5 | AVG WT = ΣWT/n ตรงทศนิยม 2 ตำแหน่ง | เทียบ expected |

> แนะนำเขียน invariant เป็น helper function (เช่น `expectValidInvariants(result, bt)`) แล้วเรียกในทุกเคส — ได้การตรวจซ้ำฟรีโดยไม่ต้องเขียนเคสแยก

## 10.6 Validation — `validateInput()`

| ID | กรณี | Input | Expected |
|---|---|---|---|
| U-V1 | จำนวนโปรเซสว่าง | processCount ว่าง | error E1 |
| U-V2 | จำนวนโปรเซส = 0 / ติดลบ / ทศนิยม | 0, -2, 1.5 | error E2 |
| U-V3 | จำนวนโปรเซส = 11 | 11 | error E3 |
| U-V4 | BT ว่าง 1 แถว | [5,"",8] | error E4 ระบุ P2 |
| U-V5 | BT = 0 / ติดลบ / ทศนิยม | [5,0,8], [5,-1,8], [5,2.5,8] | error E4 ระบุแถวที่ผิด |
| U-V6 | BT ว่างหลายแถว | ["","",8] | error E5 |
| U-V7 | q = 0 / -1 / 2.5 / ว่าง (เมื่อเลือก RR) | ตามสเปก | error E6 |
| U-V8 | ไม่เลือกอัลกอริทึมเลย | [] | error E7 |
| U-V9 | input ถูกต้องทุกอย่าง | SET-A ครบ | คืน array ว่าง |

รหัสข้อความ E1–E7 อ้างอิง [02-REQUIREMENTS §2.5](02-REQUIREMENTS.md)

## 10.7 เกณฑ์ผ่านชั้นนี้

- ทุกเคสข้างบนผ่าน 100% (`npm run test` ไม่มี fail)
- เคส U-F1, U-S1, U-R1 คือหลักฐานว่าตรรกะตรงกับการคำนวณมือ — ต้องเทียบ **ทุกช่อง** ไม่ใช่แค่ AVG

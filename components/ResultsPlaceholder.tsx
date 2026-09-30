import { ALGORITHM_META } from "./algorithm-styles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/**
 * Empty state แบบ "ghost preview" — แสดงโครงผลลัพธ์จริงในระดับเส้นกราฟ
 * ให้ผู้ใช้เห็นล่วงหน้าว่าจะได้อะไร แทนกล่องว่าง ๆ แบบเว็บทั่วไป
 * ทุก element เป็น decoration ล้วน (aria-hidden) ไม่รบกวน screen reader
 */
const GHOST_PROCESSES = [
  { id: 1, bt: 42, st: 22, ct: 78, tat: 62, wt: 34 },
  { id: 2, bt: 64, st: 55, ct: 46, tat: 38, wt: 70 },
  { id: 3, bt: 30, st: 78, ct: 62, tat: 85, wt: 48 },
];

export default function ResultsPlaceholder() {
  return (
    <div className="space-y-6">
      <p className="sr-only">
        ยังไม่มีผลลัพธ์ — ตั้งค่าในแผงด้านซ้ายแล้วกดคำนวณผลลัพธ์ จะแสดงตาราง
        ST CT TAT WT และ Gantt Chart ของแต่ละอัลกอริทึม
      </p>
      {/* แผงเปรียบเทียบ (ghost) */}
      <div aria-hidden>
      <Card size="sm" className="opacity-45">
        <CardHeader>
          <CardTitle>เปรียบเทียบ AVG Waiting Time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(Object.keys(ALGORITHM_META) as (keyof typeof ALGORITHM_META)[]).map((name) => (
            <div key={name}>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm">
                  <span
                    className={`size-2 shrink-0 rounded-[3px] ${ALGORITHM_META[name].dot}`}
                  />
                  <span className="font-medium">{ALGORITHM_META[name].fullName}</span>
                </span>
                <span className="font-mono text-sm tabular">
                  {name === "FCFS" ? "•.··" : name === "SJF" ? "·.··" : "•·.·"}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-sm bg-muted">
                <div
                  className={`h-full rounded-sm ${ALGORITHM_META[name].bar}`}
                  style={{ width: `${name === "FCFS" ? 62 : name === "SJF" ? 46 : 92}%`, opacity: 0.5 }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      </div>

      {/* การ์ดผลลัพธ์ตัวอย่าง (ghost) */}
      <div aria-hidden>
      <Card className="opacity-45">
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-[3px] bg-sky-400" />
            ตารางผลลัพธ์ต่ออัลกอริทึม
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* ghost table */}
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-[11px] tracking-wide text-muted-foreground uppercase">
                  <th className="px-3 py-2 text-left font-medium">Process</th>
                  <th className="px-3 py-2 text-right font-medium">BT</th>
                  <th className="px-3 py-2 text-right font-medium">ST</th>
                  <th className="px-3 py-2 text-right font-medium">CT</th>
                  <th className="px-3 py-2 text-right font-medium">TAT</th>
                  <th className="px-3 py-2 text-right font-medium">WT</th>
                </tr>
              </thead>
              <tbody>
                {GHOST_PROCESSES.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="px-3 py-2 font-medium">P{p.id}</td>
                    <td className="px-3 py-2 text-right">
                      <Bar value={p.bt} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Bar value={p.st} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Bar value={p.ct} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Bar value={p.tat} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Bar value={p.wt} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Separator />

          {/* ghost gantt */}
          <div>
            <p className="mb-2.5 text-xs font-medium text-muted-foreground">Gantt Chart</p>
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 h-9">
                {[20, 40, 60, 80].map((x) => (
                  <div
                    key={x}
                    className="absolute top-0 bottom-0 w-px bg-foreground/10"
                    style={{ left: `${x}%` }}
                  />
                ))}
              </div>
              <div className="relative flex h-9 gap-px">
                {[
                  { w: 18, c: "bg-sky-400" },
                  { w: 10, c: "bg-violet-400" },
                  { w: 14, c: "bg-emerald-400" },
                  { w: 8, c: "bg-sky-400" },
                  { w: 20, c: "bg-amber-400" },
                  { w: 12, c: "bg-emerald-400" },
                  { w: 18, c: "bg-violet-400" },
                ].map((seg, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-center rounded-[4px] opacity-50 ${seg.c}`}
                    style={{ width: `${seg.w}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* คำอธิบายจริง (ไม่ ghost) ให้ screen reader และผู้ใช้อ่าน */}
      <p className="text-center text-sm text-muted-foreground">
        ภาพตัวอย่างโครงสร้างผลลัพธ์ — ตั้งค่าทางซ้ายแล้วกด&ldquo;คำนวณผลลัพธ์&rdquo; เพื่อแสดงค่าจริง
      </p>
    </div>
  );
}

/** แท่ง ghost แทนตัวเลขในตาราง — ความยาวสุ่มตาม ratio ของค่า */
function Bar({ value }: { value: number }) {
  return (
    <span className="inline-block h-2 rounded-[2px] bg-foreground/25" style={{ width: `${value * 0.55}px` }} />
  );
}

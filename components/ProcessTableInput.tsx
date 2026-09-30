import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ProcessTableInputProps {
  burstTimes: string[]
  /** โหมดสุ่ม: ช่อง readonly แต่ยังแสดงค่าที่ใช้คำนวณจริง */
  readOnly: boolean
  onChange: (index: number, value: string) => void
  /** คืนข้อความ error ของแถวนั้น (ถ้ามี) เพื่อขอบแดง + inline message */
  errorFor: (processId: number) => string | undefined
}

/** ตารางกรอก Burst Time รายโปรเซส P1…Pn */
export default function ProcessTableInput({
  burstTimes,
  readOnly,
  onChange,
  errorFor,
}: ProcessTableInputProps) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full table-auto text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-[11px] tracking-wide text-muted-foreground uppercase">
            <th className="px-3 py-2 text-left font-medium">Process</th>
            <th className="px-3 py-2 text-right font-medium">Burst Time</th>
          </tr>
        </thead>
        <tbody>
          {burstTimes.map((bt, index) => {
            const error = errorFor(index + 1);
            return (
              <tr
                key={index}
                className="border-b transition-colors last:border-0 hover:bg-muted/30"
              >
                <td className="px-3 py-1.5">
                  <span className="inline-flex items-center gap-2 font-mono text-sm font-medium text-foreground">
                    <span
                      className={cn(
                        "size-1.5 rounded-[2px]",
                        error ? "bg-destructive" : "bg-border"
                      )}
                    />
                    P{index + 1}
                  </span>
                </td>
                <td className="px-3 py-1.5">
                  <Input
                    type="number"
                    min={1}
                    aria-label={`P${index + 1} Burst Time`}
                    aria-invalid={Boolean(error)}
                    value={bt}
                    readOnly={readOnly}
                    onChange={(e) => onChange(index, e.target.value)}
                    className={cn(
                      "h-8 w-20 border-0 px-2.5 py-1 text-right font-mono tabular shadow-none focus-visible:ring-1",
                      readOnly && "bg-transparent text-muted-foreground",
                      error && "border-destructive bg-destructive/10 text-destructive"
                    )}
                  />
                  {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface ProcessTableInputProps {
  burstTimes: string[]
  /** โหมดสุ่ม: ช่อง readonly แต่ยังแสดงค่าที่ใช้คำนวณจริง */
  readOnly: boolean
  onChange: (index: number, value: string) => void
  /** คืนข้อความ error ของแถวนั้น (ถ้ามี) เพื่อขอบแดง + inline message */
  errorFor: (processId: number) => string | undefined
}

/** ตารางกรอก Burst Time รายโปรเซส P1…Pn — ใช้ shadcn Table primitives เดียวกับตารางผลลัพธ์ */
export default function ProcessTableInput({
  burstTimes,
  readOnly,
  onChange,
  errorFor,
}: ProcessTableInputProps) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table className="text-sm">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-9 bg-muted/50">Process</TableHead>
            <TableHead className="h-9 bg-muted/50 text-right">Burst Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {burstTimes.map((bt, index) => {
            const error = errorFor(index + 1);
            return (
              <TableRow key={index} className="hover:bg-muted/30">
                <TableCell className="py-1.5">
                  <span className="inline-flex items-center gap-2 font-mono text-sm font-medium text-foreground">
                    <span
                      className={cn(
                        "size-1.5 rounded-[2px]",
                        error ? "bg-destructive" : "bg-border"
                      )}
                    />
                    P{index + 1}
                  </span>
                </TableCell>
                <TableCell className="py-1.5">
                  <Input
                    type="number"
                    min={1}
                    aria-label={`P${index + 1} Burst Time`}
                    aria-invalid={Boolean(error)}
                    value={bt}
                    readOnly={readOnly}
                    onChange={(e) => onChange(index, e.target.value)}
                    className={cn(
                      "h-8 w-20 px-2.5 text-right font-mono tabular",
                      // ชดเชยขอบของ wrapper: ให้ตัว input เองเป็นตัวกำหนดสถานะ
                      "border-transparent bg-transparent shadow-none focus-visible:ring-1",
                      readOnly && "text-muted-foreground",
                      error &&
                        "border-destructive bg-destructive/10 text-destructive focus-visible:ring-destructive/40"
                    )}
                  />
                  {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

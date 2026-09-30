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
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full table-auto text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] uppercase tracking-wider text-slate-400">
            <th className="px-3 py-2 text-left font-semibold">Process</th>
            <th className="px-3 py-2 text-left font-semibold">Burst Time</th>
          </tr>
        </thead>
        <tbody>
          {burstTimes.map((bt, index) => {
            const error = errorFor(index + 1);
            return (
              <tr key={index} className="border-b border-slate-50 last:border-0">
                <td className="px-3 py-1.5">
                  <span className="inline-flex items-center gap-2 font-mono text-sm font-medium text-slate-700">
                    <span className={`size-1.5 rounded-full ${error ? "bg-red-500" : "bg-slate-300"}`} />
                    P{index + 1}
                  </span>
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    min={1}
                    aria-label={`P${index + 1} Burst Time`}
                    value={bt}
                    readOnly={readOnly}
                    onChange={(e) => onChange(index, e.target.value)}
                    className={`w-24 rounded-lg border px-2.5 py-1.5 text-right font-mono tabular transition ${
                      error
                        ? "border-red-400 bg-red-50/60 ring-2 ring-red-100"
                        : readOnly
                          ? "border-transparent bg-slate-50 text-slate-600"
                          : "border-slate-200 bg-white text-slate-800 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none"
                    }`}
                  />
                  {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

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
    <div className="overflow-x-auto">
      <table className="w-full min-w-[320px] table-auto text-sm">
        <thead>
          <tr className="bg-slate-100 text-left text-slate-700">
            <th className="px-3 py-2">Process</th>
            <th className="px-3 py-2">Burst Time</th>
          </tr>
        </thead>
        <tbody>
          {burstTimes.map((bt, index) => {
            const error = errorFor(index + 1);
            return (
              <tr key={index} className="border-b border-slate-200">
                <td className="px-3 py-2 font-medium">P{index + 1}</td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={1}
                    aria-label={`P${index + 1} Burst Time`}
                    value={bt}
                    readOnly={readOnly}
                    onChange={(e) => onChange(index, e.target.value)}
                    className={`w-24 rounded-md border px-2 py-1 ${
                      error
                        ? "border-red-500 ring-1 ring-red-300"
                        : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
                    } ${readOnly ? "bg-slate-100 text-slate-600" : "bg-white"}`}
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

interface ResultTableProps {
  processes: {
    id: number
    burstTime: number
    startTime: number
    completionTime: number
    turnaroundTime: number
    waitingTime: number
  }[]
}

/** ตาราง Process | BT | ST | CT | TAT | WT — เรียงตาม P1…Pn เสมอ */
export default function ResultTable({ processes }: ResultTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] table-auto text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-[11px] tracking-wider text-slate-400 uppercase">
            <th className="px-2 py-2 text-left font-semibold">Process</th>
            <th className="px-2 py-2 text-right font-semibold">BT</th>
            <th className="px-2 py-2 text-right font-semibold">ST</th>
            <th className="px-2 py-2 text-right font-semibold">CT</th>
            <th className="px-2 py-2 text-right font-semibold">TAT</th>
            <th className="px-2 py-2 text-right font-semibold">WT</th>
          </tr>
        </thead>
        <tbody className="font-mono tabular">
          {processes.map((p) => (
            <tr
              key={p.id}
              className="border-b border-slate-50 transition last:border-0 hover:bg-slate-50/70"
            >
              <td className="px-2 py-2 text-left font-sans font-semibold text-slate-800">
                P{p.id}
              </td>
              <td className="px-2 py-2 text-right text-slate-500">{p.burstTime}</td>
              <td className="px-2 py-2 text-right text-slate-500">{p.startTime}</td>
              <td className="px-2 py-2 text-right font-medium text-slate-700">
                {p.completionTime}
              </td>
              <td className="px-2 py-2 text-right text-slate-600">{p.turnaroundTime}</td>
              <td className="px-2 py-2 text-right font-semibold text-slate-900">
                {p.waitingTime}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
          <tr className="bg-slate-700 text-left text-white">
            <th className="px-3 py-2">Process</th>
            <th className="px-3 py-2 text-right">BT</th>
            <th className="px-3 py-2 text-right">ST</th>
            <th className="px-3 py-2 text-right">CT</th>
            <th className="px-3 py-2 text-right">TAT</th>
            <th className="px-3 py-2 text-right">WT</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p) => (
            <tr key={p.id} className="border-b border-slate-200 odd:bg-slate-50">
              <td className="px-3 py-2 font-medium">P{p.id}</td>
              <td className="px-3 py-2 text-right">{p.burstTime}</td>
              <td className="px-3 py-2 text-right">{p.startTime}</td>
              <td className="px-3 py-2 text-right">{p.completionTime}</td>
              <td className="px-3 py-2 text-right">{p.turnaroundTime}</td>
              <td className="px-3 py-2 text-right">{p.waitingTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

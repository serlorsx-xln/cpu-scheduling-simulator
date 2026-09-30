import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="h-9">Process</TableHead>
          <TableHead className="h-9 text-right">BT</TableHead>
          <TableHead className="h-9 text-right">ST</TableHead>
          <TableHead className="h-9 text-right">CT</TableHead>
          <TableHead className="h-9 text-right">TAT</TableHead>
          <TableHead className="h-9 text-right">WT</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {processes.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-sans font-medium">P{p.id}</TableCell>
            <TableCell className="text-right font-mono tabular text-muted-foreground">
              {p.burstTime}
            </TableCell>
            <TableCell className="text-right font-mono tabular text-muted-foreground">
              {p.startTime}
            </TableCell>
            <TableCell className="text-right font-mono tabular">{p.completionTime}</TableCell>
            <TableCell className="text-right font-mono tabular text-muted-foreground">
              {p.turnaroundTime}
            </TableCell>
            <TableCell className="text-right font-mono tabular font-semibold">
              {p.waitingTime}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

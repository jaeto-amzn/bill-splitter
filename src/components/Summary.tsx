import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCents } from '@/lib/money'
import type { BillSummary } from '@/lib/types'

export function Summary({ summary }: { summary: BillSummary }) {
  const { shares, subtotalCents, taxCents, tipCents, grandTotalCents, unassignedCents } = summary

  return (
    <Card>
      <CardHeader>
        <CardTitle>Who owes what</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Diner</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Tax</TableHead>
              <TableHead className="text-right">Tip</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shares.map((s) => (
              <TableRow key={s.dinerId}>
                <TableCell className="font-medium">{s.name || 'Unnamed'}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCents(s.subtotalCents)}
                </TableCell>
                <TableCell className="text-muted-foreground text-right tabular-nums">
                  {formatCents(s.taxCents)}
                </TableCell>
                <TableCell className="text-muted-foreground text-right tabular-nums">
                  {formatCents(s.tipCents)}
                </TableCell>
                <TableCell className="text-primary text-right font-semibold tabular-nums">
                  {formatCents(s.totalCents)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-1 border-t pt-3 text-sm">
          <Row label="Subtotal" value={formatCents(subtotalCents)} />
          <Row label="Tax" value={formatCents(taxCents)} />
          <Row label="Tip" value={formatCents(tipCents)} />
          <Row label="Grand total" value={formatCents(grandTotalCents)} strong />
        </div>

        {unassignedCents > 0 && (
          <p className="text-destructive flex items-center gap-2 text-sm">
            <AlertTriangle className="size-4" />
            {formatCents(unassignedCents)} of items are unassigned and not included above.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={strong ? 'font-semibold' : 'text-muted-foreground'}>{label}</span>
      <span className={`tabular-nums ${strong ? 'text-lg font-bold' : ''}`}>{value}</span>
    </div>
  )
}

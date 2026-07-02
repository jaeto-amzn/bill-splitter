import { useState } from 'react'
import { Percent, BadgeDollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { dollarsToCents, formatCents } from '@/lib/money'
import type { BillState } from '@/lib/types'

interface Props {
  state: BillState
  tipCents: number
  onSetTax: (cents: number) => void
  onSetLiquorTaxPercent: (percent: number) => void
  onSetTip: (patch: Partial<Pick<BillState, 'tipMode' | 'tipPercent' | 'tipCents'>>) => void
}

const TIP_PRESETS = [15, 18, 20, 25]

export function TaxTipControls({ state, tipCents, onSetTax, onSetLiquorTaxPercent, onSetTip }: Props) {
  const [taxText, setTaxText] = useState<string | null>(null)
  const [tipText, setTipText] = useState<string | null>(null)

  const taxDisplay = taxText ?? (state.taxCents ? (state.taxCents / 100).toFixed(2) : '')
  const tipAmtDisplay = tipText ?? (state.tipCents ? (state.tipCents / 100).toFixed(2) : '')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax &amp; Tip</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Tax */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Tax (from receipt)</label>
          <div className="relative w-40">
            <span className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
              $
            </span>
            <Input
              inputMode="decimal"
              placeholder="0.00"
              value={taxDisplay}
              onChange={(e) => setTaxText(e.target.value)}
              onFocus={() => setTaxText(state.taxCents ? (state.taxCents / 100).toFixed(2) : '')}
              onBlur={() => {
                onSetTax(dollarsToCents(taxText ?? ''))
                setTaxText(null)
              }}
              className="pl-7 text-right tabular-nums"
            />
          </div>
        </div>

        {/* Liquor tax */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">🍺 Liquor tax rate</label>
          <div className="flex items-center gap-2">
            <div className="relative w-28">
              <Input
                inputMode="decimal"
                placeholder="0"
                value={state.liquorTaxPercent || ''}
                onChange={(e) => {
                  const v = Number.parseFloat(e.target.value.replace(/[^0-9.]/g, ''))
                  onSetLiquorTaxPercent(Number.isFinite(v) ? v : 0)
                }}
                className="pr-7 text-right tabular-nums"
              />
              <span className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                %
              </span>
            </div>
            <span className="text-muted-foreground text-xs">applied to 🍺 items only</span>
          </div>
        </div>

        {/* Tip mode toggle */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Tip</label>
          <div className="bg-muted inline-flex w-fit rounded-md p-0.5">
            <button
              type="button"
              onClick={() => onSetTip({ tipMode: 'percent' })}
              className={cn(
                'inline-flex items-center gap-1 rounded px-3 py-1 text-sm transition-colors',
                state.tipMode === 'percent'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground',
              )}
            >
              <Percent className="size-3.5" /> Percent
            </button>
            <button
              type="button"
              onClick={() => onSetTip({ tipMode: 'amount' })}
              className={cn(
                'inline-flex items-center gap-1 rounded px-3 py-1 text-sm transition-colors',
                state.tipMode === 'amount'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground',
              )}
            >
              <BadgeDollarSign className="size-3.5" /> Amount
            </button>
          </div>

          {state.tipMode === 'percent' ? (
            <div className="flex flex-wrap items-center gap-2">
              {TIP_PRESETS.map((p) => (
                <Button
                  key={p}
                  variant={state.tipPercent === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onSetTip({ tipPercent: p })}
                >
                  {p}%
                </Button>
              ))}
              <div className="relative w-24">
                <Input
                  inputMode="decimal"
                  aria-label="Custom tip percent"
                  value={state.tipPercent || ''}
                  onChange={(e) => {
                    const v = Number.parseFloat(e.target.value.replace(/[^0-9.]/g, ''))
                    onSetTip({ tipPercent: Number.isFinite(v) ? v : 0 })
                  }}
                  className="pr-7 text-right tabular-nums"
                />
                <span className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  %
                </span>
              </div>
              <span className="text-muted-foreground text-sm tabular-nums">
                = {formatCents(tipCents)}
              </span>
            </div>
          ) : (
            <div className="relative w-40">
              <span className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                $
              </span>
              <Input
                inputMode="decimal"
                placeholder="0.00"
                value={tipAmtDisplay}
                onChange={(e) => setTipText(e.target.value)}
                onFocus={() =>
                  setTipText(state.tipCents ? (state.tipCents / 100).toFixed(2) : '')
                }
                onBlur={() => {
                  onSetTip({ tipCents: dollarsToCents(tipText ?? '') })
                  setTipText(null)
                }}
                className="pl-7 text-right tabular-nums"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

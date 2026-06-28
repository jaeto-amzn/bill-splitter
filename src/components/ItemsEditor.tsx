import { useState } from 'react'
import { Plus, Trash2, Receipt, Users2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { dollarsToCents, formatCents, splitEqually } from '@/lib/money'
import type { Diner, Item } from '@/lib/types'

interface Props {
  items: Item[]
  diners: Diner[]
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<Item>) => void
  onRemove: (id: string) => void
  onToggleDiner: (itemId: string, dinerId: string) => void
  onAssignAll: (itemId: string) => void
}

/** Editable dollar field that keeps raw text while focused. */
function PriceInput({
  priceCents,
  onCommit,
}: {
  priceCents: number
  onCommit: (cents: number) => void
}) {
  const [text, setText] = useState<string | null>(null)
  const display = text ?? (priceCents ? (priceCents / 100).toFixed(2) : '')
  return (
    <Input
      inputMode="decimal"
      aria-label="Item price"
      placeholder="0.00"
      value={display}
      onChange={(e) => setText(e.target.value)}
      onFocus={() => setText(priceCents ? (priceCents / 100).toFixed(2) : '')}
      onBlur={() => {
        onCommit(dollarsToCents(text ?? ''))
        setText(null)
      }}
      className="w-24 text-right tabular-nums"
    />
  )
}

export function ItemsEditor({
  items,
  diners,
  onAdd,
  onUpdate,
  onRemove,
  onToggleDiner,
  onAssignAll,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="text-primary" />
          Items
          <span className="text-muted-foreground text-sm font-normal">({items.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {items.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No items yet. Add each dish, set its price, then tap the diners who shared it.
          </p>
        )}

        {items.map((item) => {
          const sharers = item.dinerIds.filter((id) => diners.some((d) => d.id === id))
          const perHead =
            sharers.length > 0 ? splitEqually(item.priceCents, sharers.length)[0] : 0
          return (
            <div key={item.id} className="rounded-lg border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  aria-label="Item name"
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) => onUpdate(item.id, { name: e.target.value })}
                  className="min-w-[8rem] flex-1"
                />
                <PriceInput
                  priceCents={item.priceCents}
                  onCommit={(cents) => onUpdate(item.id, { priceCents: cents })}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove item"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => onRemove(item.id)}
                >
                  <Trash2 />
                </Button>
              </div>

              {diners.length > 0 && (
                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Shared by
                    </span>
                    <button
                      type="button"
                      onClick={() => onAssignAll(item.id)}
                      className="text-primary inline-flex items-center gap-1 text-xs hover:underline"
                    >
                      <Users2 className="size-3" /> Everyone
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {diners.map((d) => {
                      const active = item.dinerIds.includes(d.id)
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => onToggleDiner(item.id, d.id)}
                          aria-pressed={active}
                          className={cn(
                            'rounded-full border px-3 py-1 text-sm transition-colors',
                            active
                              ? 'bg-primary text-primary-foreground border-transparent'
                              : 'bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                          )}
                        >
                          {d.name || 'Unnamed'}
                        </button>
                      )
                    })}
                  </div>
                  {sharers.length > 0 ? (
                    <p className="text-muted-foreground text-xs tabular-nums">
                      {formatCents(perHead)} each · split {sharers.length} way
                      {sharers.length > 1 ? 's' : ''}
                    </p>
                  ) : (
                    <p className="text-destructive text-xs">Unassigned — not counted yet</p>
                  )}
                </div>
              )}
            </div>
          )
        })}

        <Button variant="outline" onClick={onAdd} className="self-start">
          <Plus /> Add item
        </Button>
      </CardContent>
    </Card>
  )
}

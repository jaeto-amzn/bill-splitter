import { allocateProportional, splitEqually } from './money'
import type { BillState, BillSummary, DinerShare } from './types'

/** Resolve the tip total (cents) from the current tip mode + subtotal. */
export function resolveTipCents(state: BillState, subtotalCents: number): number {
  if (state.tipMode === 'amount') return Math.max(0, state.tipCents)
  const pct = Math.max(0, state.tipPercent)
  return Math.round((subtotalCents * pct) / 100)
}

/**
 * Compute the full bill breakdown.
 *
 * 1. Each item's price is split equally among its assigned diners
 *    (exact integer-cent split — first sharers absorb odd cents).
 * 2. Each diner's subtotal is the sum of their item shares.
 * 3. Tax and tip are each allocated across diners in proportion to
 *    their subtotals, using largest-remainder so the parts sum exactly.
 */
export function computeSummary(state: BillState): BillSummary {
  const { diners, items } = state

  // dinerId -> subtotal in cents
  const subtotals = new Map<string, number>()
  diners.forEach((d) => subtotals.set(d.id, 0))

  let unassignedCents = 0

  for (const item of items) {
    const sharers = item.dinerIds.filter((id) => subtotals.has(id))
    if (sharers.length === 0) {
      unassignedCents += item.priceCents
      continue
    }
    const shares = splitEqually(item.priceCents, sharers.length)
    sharers.forEach((id, i) => {
      subtotals.set(id, (subtotals.get(id) ?? 0) + shares[i])
    })
  }

  const subtotalCents = diners.reduce((sum, d) => sum + (subtotals.get(d.id) ?? 0), 0)
  const taxCents = Math.max(0, state.taxCents)
  const tipCents = resolveTipCents(state, subtotalCents)

  const weights = diners.map((d) => subtotals.get(d.id) ?? 0)
  const taxParts = allocateProportional(taxCents, weights)
  const tipParts = allocateProportional(tipCents, weights)

  const shares: DinerShare[] = diners.map((d, i) => {
    const sub = subtotals.get(d.id) ?? 0
    const tax = taxParts[i] ?? 0
    const tip = tipParts[i] ?? 0
    return {
      dinerId: d.id,
      name: d.name,
      subtotalCents: sub,
      taxCents: tax,
      tipCents: tip,
      totalCents: sub + tax + tip,
    }
  })

  return {
    shares,
    subtotalCents,
    taxCents,
    tipCents,
    grandTotalCents: subtotalCents + taxCents + tipCents,
    unassignedCents,
  }
}

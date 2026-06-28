// Domain model for the bill splitter.

/** A person sharing the bill. */
export interface Diner {
  id: string
  name: string
}

/**
 * A line item from the receipt. Its price is split equally among every
 * diner listed in `dinerIds` (a "portion" each). An item with two diners
 * means each ate half; with one diner, that diner ate all of it.
 */
export interface Item {
  id: string
  name: string
  /** Pre-tax price in integer cents. */
  priceCents: number
  /** Diners sharing this item. Empty = unassigned (excluded from totals). */
  dinerIds: string[]
}

/** How the tip is entered. */
export type TipMode = 'percent' | 'amount'

export interface BillState {
  diners: Diner[]
  items: Item[]
  /** Tax in integer cents (entered directly from the receipt). */
  taxCents: number
  tipMode: TipMode
  /** Tip percentage (of pre-tax subtotal) when tipMode === 'percent'. */
  tipPercent: number
  /** Tip in integer cents when tipMode === 'amount'. */
  tipCents: number
}

/** Per-diner computed breakdown, all in integer cents. */
export interface DinerShare {
  dinerId: string
  name: string
  subtotalCents: number
  taxCents: number
  tipCents: number
  totalCents: number
}

export interface BillSummary {
  shares: DinerShare[]
  subtotalCents: number
  taxCents: number
  tipCents: number
  grandTotalCents: number
  /** Cents belonging to items with no diner assigned. */
  unassignedCents: number
}

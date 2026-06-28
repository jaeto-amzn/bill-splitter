// Money and allocation helpers — all math is done in integer cents to
// avoid floating-point drift. Allocations use the largest-remainder
// (Hamilton) method so the parts always sum back to the exact total.

/** Parse a user-typed dollar string (e.g. "12.50", "$3", "") to integer cents. */
export function dollarsToCents(input: string): number {
  if (!input) return 0
  const cleaned = input.replace(/[^0-9.]/g, '')
  if (!cleaned) return 0
  const value = Number.parseFloat(cleaned)
  if (!Number.isFinite(value) || value < 0) return 0
  return Math.round(value * 100)
}

/** Format integer cents as a "$1,234.56" string. */
export function formatCents(cents: number): string {
  const sign = cents < 0 ? '-' : ''
  const abs = Math.abs(cents)
  const dollars = Math.floor(abs / 100)
  const remainder = abs % 100
  return `${sign}$${dollars.toLocaleString('en-US')}.${remainder.toString().padStart(2, '0')}`
}

/**
 * Split `totalCents` across `count` equal shares.
 * Returns an array of integer cents that sums exactly to `totalCents`;
 * the first `remainder` shares get one extra cent.
 */
export function splitEqually(totalCents: number, count: number): number[] {
  if (count <= 0) return []
  const base = Math.floor(totalCents / count)
  const remainder = totalCents - base * count
  return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0))
}

/**
 * Allocate `totalCents` proportionally to `weights`, using the
 * largest-remainder method. The returned array sums exactly to
 * `totalCents`. If all weights are zero, falls back to an equal split.
 */
export function allocateProportional(totalCents: number, weights: number[]): number[] {
  const n = weights.length
  if (n === 0) return []
  const weightSum = weights.reduce((a, b) => a + b, 0)
  if (weightSum <= 0) return splitEqually(totalCents, n)

  // Exact (fractional) ideal share for each weight.
  const ideal = weights.map((w) => (totalCents * w) / weightSum)
  const floors = ideal.map((x) => Math.floor(x))
  let distributed = floors.reduce((a, b) => a + b, 0)
  let leftover = totalCents - distributed

  // Rank by largest fractional remainder; ties broken by original order.
  const order = ideal
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i)

  const result = [...floors]
  for (let k = 0; k < order.length && leftover > 0; k++) {
    result[order[k].i] += 1
    leftover -= 1
  }
  return result
}

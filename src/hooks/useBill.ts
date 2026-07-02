import { useCallback, useEffect, useMemo, useState } from 'react'
import { computeSummary } from '@/lib/split'
import type { BillState, Item } from '@/lib/types'

const STORAGE_KEY = 'bill-splitter:v1'

let counter = 0
function uid(prefix: string): string {
  counter += 1
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}`
}

function defaultState(): BillState {
  const a = uid('d')
  const b = uid('d')
  return {
    diners: [
      { id: a, name: 'Diner 1' },
      { id: b, name: 'Diner 2' },
    ],
    items: [],
    taxCents: 0,
    liquorTaxPercent: 10,
    tipMode: 'percent',
    tipPercent: 18,
    tipCents: 0,
  }
}

function loadState(): BillState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<BillState>
    if (!Array.isArray(parsed.diners) || !Array.isArray(parsed.items)) {
      return defaultState()
    }
    return {
      diners: parsed.diners,
      items: parsed.items,
      taxCents: parsed.taxCents ?? 0,
      liquorTaxPercent: parsed.liquorTaxPercent ?? 10,
      tipMode: parsed.tipMode ?? 'percent',
      tipPercent: parsed.tipPercent ?? 18,
      tipCents: parsed.tipCents ?? 0,
    }
  } catch {
    return defaultState()
  }
}

export function useBill() {
  const [state, setState] = useState<BillState>(loadState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore quota / private-mode errors
    }
  }, [state])

  const addDiner = useCallback((name?: string) => {
    setState((s) => ({
      ...s,
      diners: [...s.diners, { id: uid('d'), name: name?.trim() || `Diner ${s.diners.length + 1}` }],
    }))
  }, [])

  const renameDiner = useCallback((id: string, name: string) => {
    setState((s) => ({
      ...s,
      diners: s.diners.map((d) => (d.id === id ? { ...d, name } : d)),
    }))
  }, [])

  const removeDiner = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      diners: s.diners.filter((d) => d.id !== id),
      items: s.items.map((it) => ({ ...it, dinerIds: it.dinerIds.filter((x) => x !== id) })),
    }))
  }, [])

  const addItem = useCallback((item?: Partial<Item>) => {
    setState((s) => ({
      ...s,
      items: [
        ...s.items,
        {
          id: uid('i'),
          name: item?.name ?? '',
          priceCents: item?.priceCents ?? 0,
          dinerIds: item?.dinerIds ?? [],
        },
      ],
    }))
  }, [])

  const updateItem = useCallback((id: string, patch: Partial<Item>) => {
    setState((s) => ({
      ...s,
      items: s.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }))
  }, [])

  const removeItem = useCallback((id: string) => {
    setState((s) => ({ ...s, items: s.items.filter((it) => it.id !== id) }))
  }, [])

  const toggleItemDiner = useCallback((itemId: string, dinerId: string) => {
    setState((s) => ({
      ...s,
      items: s.items.map((it) => {
        if (it.id !== itemId) return it
        const has = it.dinerIds.includes(dinerId)
        return {
          ...it,
          dinerIds: has
            ? it.dinerIds.filter((x) => x !== dinerId)
            : [...it.dinerIds, dinerId],
        }
      }),
    }))
  }, [])

  const assignAll = useCallback((itemId: string) => {
    setState((s) => ({
      ...s,
      items: s.items.map((it) =>
        it.id === itemId ? { ...it, dinerIds: s.diners.map((d) => d.id) } : it,
      ),
    }))
  }, [])

  const setTax = useCallback((taxCents: number) => {
    setState((s) => ({ ...s, taxCents }))
  }, [])

  const setLiquorTaxPercent = useCallback((liquorTaxPercent: number) => {
    setState((s) => ({ ...s, liquorTaxPercent }))
  }, [])

  const setTip = useCallback(
    (patch: Partial<Pick<BillState, 'tipMode' | 'tipPercent' | 'tipCents'>>) => {
      setState((s) => ({ ...s, ...patch }))
    },
    [],
  )

  const reset = useCallback(() => setState(defaultState()), [])

  const summary = useMemo(() => computeSummary(state), [state])

  return {
    state,
    summary,
    addDiner,
    renameDiner,
    removeDiner,
    addItem,
    updateItem,
    removeItem,
    toggleItemDiner,
    assignAll,
    setTax,
    setLiquorTaxPercent,
    setTip,
    reset,
  }
}

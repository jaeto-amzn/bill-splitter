import { RotateCcw, SplitSquareHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DinerManager } from '@/components/DinerManager'
import { ItemsEditor } from '@/components/ItemsEditor'
import { TaxTipControls } from '@/components/TaxTipControls'
import { Summary } from '@/components/Summary'
import { useBill } from '@/hooks/useBill'

export default function App() {
  const bill = useBill()
  const { state, summary } = bill

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <SplitSquareHorizontal className="text-primary size-7" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bill Splitter</h1>
            <p className="text-muted-foreground text-sm">
              Split by who ate what — tax &amp; tip divided proportionally.
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={bill.reset}>
          <RotateCcw /> Reset
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <DinerManager
            diners={state.diners}
            onAdd={bill.addDiner}
            onRename={bill.renameDiner}
            onRemove={bill.removeDiner}
          />
          <TaxTipControls
            state={state}
            tipCents={summary.tipCents}
            onSetTax={bill.setTax}
            onSetTip={bill.setTip}
          />
        </div>

        <ItemsEditor
          items={state.items}
          diners={state.diners}
          onAdd={bill.addItem}
          onUpdate={bill.updateItem}
          onRemove={bill.removeItem}
          onToggleDiner={bill.toggleItemDiner}
          onAssignAll={bill.assignAll}
        />
      </div>

      <Summary summary={summary} />

      <footer className="text-muted-foreground pt-2 text-center text-xs">
        Saved locally in your browser. Nothing leaves this device.
      </footer>
    </div>
  )
}

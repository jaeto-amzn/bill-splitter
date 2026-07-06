import { useRef, useState } from 'react'
import { Plus, X, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { Diner } from '@/lib/types'

interface Props {
  diners: Diner[]
  onAdd: (name?: string) => void
  onRename: (id: string, name: string) => void
  onRemove: (id: string) => void
}

function DinerChip({
  diner,
  onRename,
  onRemove,
}: {
  diner: Diner
  onRename: (id: string, name: string) => void
  onRemove: (id: string) => void
}) {
  const [draft, setDraft] = useState<string | null>(null)
  const cancelRef = useRef(false)

  function commit() {
    if (cancelRef.current) {
      cancelRef.current = false
      return
    }
    const trimmed = (draft ?? diner.name).trim()
    onRename(diner.id, trimmed || diner.name)
    setDraft(null)
  }

  return (
    <div className="bg-muted/60 flex items-center gap-1 rounded-md border pl-2">
      <Input
        aria-label="Diner name"
        value={draft ?? diner.name}
        onFocus={() => setDraft(diner.name)}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
          if (e.key === 'Escape') {
            cancelRef.current = true
            setDraft(null)
            e.currentTarget.blur()
          }
        }}
        className="h-8 w-32 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
      />
      <Button
        variant="ghost"
        size="icon"
        className="size-7 text-muted-foreground hover:text-destructive"
        aria-label={`Remove ${diner.name}`}
        onClick={() => onRemove(diner.id)}
      >
        <X />
      </Button>
    </div>
  )
}

export function DinerManager({ diners, onAdd, onRename, onRemove }: Props) {
  const [name, setName] = useState('')

  function submit() {
    onAdd(name)
    setName('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="text-primary" />
          Diners
          <span className="text-muted-foreground text-sm font-normal">({diners.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {diners.map((d) => (
            <DinerChip key={d.id} diner={d} onRename={onRename} onRemove={onRemove} />
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add a diner…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
          <Button onClick={submit}>
            <Plus /> Add
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

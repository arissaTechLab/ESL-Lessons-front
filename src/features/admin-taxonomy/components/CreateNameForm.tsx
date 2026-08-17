import { useState, type FormEvent } from 'react'
import { Button } from '@/shared/components'

interface CreateNameFormProps {
  /** Accessible label for the input. */
  label: string
  placeholder: string
  /** Must resolve (the caller handles errors + toasts); true = created. */
  onCreate: (name: string) => Promise<boolean>
}

/** Single-input create row used by the Categories and Topics panels. */
export function CreateNameForm({ label, placeholder, onCreate }: CreateNameFormProps) {
  const [name, setName] = useState('')
  const [isBusy, setIsBusy] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || isBusy) return

    setIsBusy(true)
    try {
      // Keep the typed name when the create failed so it can be corrected.
      if (await onCreate(trimmed)) setName('')
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <label className="flex-1">
        <span className="sr-only">{label}</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={placeholder}
          maxLength={80}
          className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink transition placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </label>
      <Button type="submit" size="sm" disabled={isBusy || !name.trim()}>
        {isBusy ? 'Adding…' : 'Add'}
      </Button>
    </form>
  )
}

import { useState, type FormEvent } from 'react'
import { Button } from '@/shared/components'
import type { CefrLevel } from '@/features/lessons'
import type { CreateLevelPayload } from '@/features/admin-taxonomy/types/taxonomy.types'
import { LevelBadge } from './LevelBadge'

/** Codes offered by the admin UI (C2 exists server-side but is not sold). */
const CEFR_OPTIONS: readonly CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1']

interface CreateLevelFormProps {
  /** Must resolve (the caller handles errors + toasts); true = created. */
  onCreate: (payload: CreateLevelPayload) => Promise<boolean>
}

/** Name + CEFR toggles + colour pickers, with a live preview of the badge. */
export function CreateLevelForm({ onCreate }: CreateLevelFormProps) {
  const [name, setName] = useState('')
  const [cefr, setCefr] = useState<CefrLevel[]>([])
  const [color, setColor] = useState('#FFAB3D')
  const [textColor, setTextColor] = useState('#27170C')
  const [isBusy, setIsBusy] = useState(false)

  // Keep the codes in canonical order regardless of click order.
  const orderedCefr = CEFR_OPTIONS.filter((code) => cefr.includes(code))
  const canSubmit = name.trim().length > 0 && orderedCefr.length > 0 && !isBusy

  const toggleCefr = (code: CefrLevel) =>
    setCefr((current) =>
      current.includes(code)
        ? current.filter((entry) => entry !== code)
        : [...current, code],
    )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return

    setIsBusy(true)
    try {
      // Keep the draft when the create failed so it can be corrected.
      if (await onCreate({ name: name.trim(), cefr: orderedCefr, color, textColor })) {
        setName('')
        setCefr([])
      }
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block">
        <span className="sr-only">New level name</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="New level…"
          maxLength={80}
          className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink transition placeholder:text-ink-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </label>

      <fieldset>
        <legend className="mb-1.5 text-xs font-semibold text-ink-soft">
          CEFR codes
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {CEFR_OPTIONS.map((code) => {
            const isSelected = cefr.includes(code)
            return (
              <button
                key={code}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleCefr(code)}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? 'border-accent-700 bg-accent-700 text-cream'
                    : 'border-ink/15 text-ink-soft hover:border-ink/30'
                }`}
              >
                {code}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-xs font-semibold text-ink-soft">
          Badge colour
          <input
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="h-8 w-10 cursor-pointer rounded border border-ink/15 bg-white p-0.5"
          />
        </label>
        <label className="flex items-center gap-2 text-xs font-semibold text-ink-soft">
          Text colour
          <input
            type="color"
            value={textColor}
            onChange={(event) => setTextColor(event.target.value)}
            className="h-8 w-10 cursor-pointer rounded border border-ink/15 bg-white p-0.5"
          />
        </label>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold text-ink-soft">Preview</p>
        <LevelBadge
          level={{
            name: name.trim() || 'Level name',
            cefr: orderedCefr,
            color,
            textColor,
          }}
        />
      </div>

      <Button type="submit" size="sm" disabled={!canSubmit} className="w-full">
        {isBusy ? 'Adding…' : 'Add level'}
      </Button>
    </form>
  )
}

import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'

const CONTROL =
  'w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted transition focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500'

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string
  children: ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-semibold text-ink"
    >
      {children}
    </label>
  )
}

type Option = { value: string; label: string }

export function AdminInput({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input id={id} className={CONTROL} {...props} />
    </div>
  )
}

export function AdminSelect({
  label,
  options,
  placeholder = 'Select…',
  ...props
}: {
  label: string
  options: readonly Option[]
  placeholder?: string
} & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId()
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select id={id} defaultValue="" className={CONTROL} {...props}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function AdminTextarea({
  label,
  ...props
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <textarea id={id} className={`${CONTROL} min-h-28 resize-y`} {...props} />
    </div>
  )
}

export function AdminFileUpload({
  label,
  accept,
  hint = 'Click to upload',
}: {
  label: string
  accept?: string
  hint?: string
}) {
  const id = useId()
  const [fileName, setFileName] = useState<string | null>(null)

  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <label
        htmlFor={id}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink/20 bg-white px-4 py-8 text-center transition hover:border-brand-400"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-6 text-ink-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="M17 8l-5-5-5 5M12 3v12" />
        </svg>
        <span className="text-sm text-ink-soft">{fileName ?? hint}</span>
        <input
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(event) =>
            setFileName(event.target.files?.[0]?.name ?? null)
          }
        />
      </label>
    </div>
  )
}

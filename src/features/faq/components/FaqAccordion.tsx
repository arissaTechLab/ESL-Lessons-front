import { useState } from 'react'
import type { Faq } from '@/features/faq/types/faq.types'

interface FaqAccordionProps {
  items: readonly Faq[]
}

/** Single-open accordion. The first item starts expanded. */
export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item) => {
        const isOpen = openId === item.id
        const panelId = `faq-panel-${item.id}`

        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 py-5 text-left transition hover:text-brand-600"
              >
                <span className="font-heading text-base font-semibold text-ink">
                  {item.question}
                </span>
                <span
                  className="grid size-6 shrink-0 place-items-center text-ink-soft"
                  aria-hidden="true"
                >
                  {isOpen ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M5 12h14" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  )}
                </span>
              </button>
            </h3>

            {isOpen && (
              <div id={panelId} className="pb-5 pr-10 text-sm text-ink-soft">
                {item.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

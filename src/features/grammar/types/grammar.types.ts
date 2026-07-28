export interface GrammarLink {
  label: string
  href: string
}

export interface GrammarEntry {
  id: string
  /** The grammar point description. */
  point: string
  /** CEFR level used for filtering. */
  level: string
  links: GrammarLink[]
}

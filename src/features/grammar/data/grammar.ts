import type { GrammarEntry } from '../types/grammar.types'

/** Level options for the grammar filter dropdown. */
export const GRAMMAR_LEVELS = [
  { value: 'B1', label: 'B1 (Intermediate)' },
  { value: 'B2', label: 'B2 (Upper-Intermediate)' },
  { value: 'C1', label: 'C1 (Advanced)' },
] as const

/** Build N placeholder lesson links. */
function links(count: number): GrammarEntry['links'] {
  return Array.from({ length: count }, () => ({
    label: 'Link for lesson goes here',
    href: '#',
  }))
}

/**
 * Mocked grammar index. Stands in for admin-managed content until the backend
 * is wired up. A grammar point can have one or several lesson links.
 */
export const GRAMMAR_ENTRIES: readonly GrammarEntry[] = [
  { id: 'adjective-endings', point: 'Adjective Endings (-ed / -ing)', level: 'B1', links: links(1) },
  { id: 'present-perfect', point: 'Present Perfect vs Past Simple', level: 'B1', links: links(2) },
  { id: 'conditionals', point: 'Conditionals (First & Second)', level: 'B2', links: links(4) },
  { id: 'reported-speech', point: 'Reported Speech', level: 'B2', links: links(1) },
  { id: 'passive-voice', point: 'The Passive Voice', level: 'B2', links: links(1) },
  { id: 'modals-deduction', point: 'Modal Verbs of Deduction', level: 'C1', links: links(3) },
  { id: 'relative-clauses', point: 'Relative Clauses', level: 'B2', links: links(1) },
  { id: 'gerunds-infinitives', point: 'Gerunds & Infinitives', level: 'B1', links: links(4) },
  { id: 'articles', point: 'Articles (a / an / the)', level: 'B1', links: links(1) },
  { id: 'comparatives', point: 'Comparatives & Superlatives', level: 'B1', links: links(1) },
  { id: 'future-forms', point: 'Future Forms (will / going to)', level: 'B1', links: links(4) },
  { id: 'phrasal-verbs', point: 'Phrasal Verbs (Separable)', level: 'C1', links: links(1) },
  { id: 'quantifiers', point: 'Quantifiers (much / many / some)', level: 'B1', links: links(1) },
  { id: 'question-tags', point: 'Question Tags', level: 'B2', links: links(1) },
]

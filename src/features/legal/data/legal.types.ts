/** One titled block of a legal document (a heading + its paragraphs). */
export interface LegalSection {
  heading: string
  /** Each string is rendered as its own paragraph. */
  paragraphs: string[]
}

/** Full editable content of a legal page (Privacy Policy / Terms of Service). */
export interface LegalContent {
  /** Shown under the page title, in the header. */
  subtitle: string
  /** e.g. "August 9, 2025". */
  lastUpdated: string
  sections: LegalSection[]
}

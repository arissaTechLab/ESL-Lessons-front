const EMAIL_RE = /^[^\s@]+@[^\s@]+$/

/** Lenient email check (something@something). */
export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim())
}

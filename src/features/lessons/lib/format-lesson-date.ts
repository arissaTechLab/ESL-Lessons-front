/** Format an ISO date (YYYY-MM-DD) as DD/MM/YYYY for display. */
export function formatLessonDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

const FORMATTERS = new Map<string, Intl.NumberFormat>()

export function formatMoney(amount: number, currency = 'USD'): string {
  let formatter = FORMATTERS.get(currency)
  if (!formatter) {
    formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency })
    FORMATTERS.set(currency, formatter)
  }
  return formatter.format(amount)
}

export function formatTransactionDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

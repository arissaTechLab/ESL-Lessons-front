import type { Transaction } from '../types/revenue.types'

/**
 * Mocked payment ledger. In production these records are synced from PayPal
 * (via webhooks) — PayPal remains the source of truth for the money.
 */
export const TRANSACTIONS: readonly Transaction[] = [
  { id: 't-01', paypalRef: '8XJ92047KL', clientName: 'Emily Roberts', plan: '12-Month Plan', amount: 99, status: 'paid', date: '2025-01-08' },
  { id: 't-02', paypalRef: '3RM55021QP', clientName: 'David Kim', plan: '6-Month Plan', amount: 59, status: 'paid', date: '2025-01-19' },
  { id: 't-03', paypalRef: '9KA10398ZC', clientName: 'Carlos Mendez', plan: '6-Month Plan', amount: 59, status: 'paid', date: '2025-02-03' },
  { id: 't-04', paypalRef: '2LP77410BD', clientName: 'Marta Nowak', plan: '6-Month Plan', amount: 59, status: 'paid', date: '2025-02-21' },
  { id: 't-05', paypalRef: '6TQ33285XN', clientName: 'James O’Brien', plan: '6-Month Plan', amount: 59, status: 'refunded', date: '2025-02-25' },
  { id: 't-06', paypalRef: '1WD64029JR', clientName: 'Ana Silva', plan: '12-Month Plan', amount: 99, status: 'paid', date: '2025-03-06' },
  { id: 't-07', paypalRef: '5BC98172YF', clientName: 'Yuki Tanaka', plan: '6-Month Plan', amount: 59, status: 'paid', date: '2025-03-18' },
  { id: 't-08', paypalRef: '7HN20563KM', clientName: 'Tom Barker', plan: '12-Month Plan', amount: 99, status: 'failed', date: '2025-03-27' },
  { id: 't-09', paypalRef: '4GX81047PL', clientName: 'Sophie Laurent', plan: '12-Month Plan', amount: 99, status: 'paid', date: '2025-04-04' },
  { id: 't-10', paypalRef: '0QJ57390RT', clientName: 'Liam Fox', plan: '6-Month Plan', amount: 59, status: 'paid', date: '2025-04-15' },
  { id: 't-11', paypalRef: '8ZP11284WC', clientName: 'Nora Bell', plan: '12-Month Plan', amount: 99, status: 'paid', date: '2025-04-28' },
  { id: 't-12', paypalRef: '3DA76052NK', clientName: 'Priya Nair', plan: '12-Month Plan', amount: 99, status: 'paid', date: '2025-05-07' },
  { id: 't-13', paypalRef: '6ML29841QB', clientName: 'Hugo Diaz', plan: '6-Month Plan', amount: 59, status: 'paid', date: '2025-05-19' },
  { id: 't-14', paypalRef: '2KR63017XD', clientName: 'Mei Chen', plan: '12-Month Plan', amount: 99, status: 'paid', date: '2025-05-30' },
  { id: 't-15', paypalRef: '9FB40728LP', clientName: 'Omar Said', plan: '12-Month Plan', amount: 99, status: 'paid', date: '2025-06-09' },
  { id: 't-16', paypalRef: '1CX85493JM', clientName: 'Ella Ward', plan: '6-Month Plan', amount: 59, status: 'paid', date: '2025-06-21' },
  { id: 't-17', paypalRef: '5NT12086KR', clientName: 'Ken Ito', plan: '12-Month Plan', amount: 99, status: 'paid', date: '2025-06-28' },
]

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const MONEY = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatMoney(amount: number): string {
  return MONEY.format(amount)
}

export function formatTransactionDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

/** Total of paid transactions per month, oldest → newest. */
export function getMonthlyRevenue(): {
  month: string
  label: string
  total: number
}[] {
  const totals = new Map<string, number>()
  for (const txn of TRANSACTIONS) {
    if (txn.status !== 'paid') continue
    const month = txn.date.slice(0, 7)
    totals.set(month, (totals.get(month) ?? 0) + txn.amount)
  }
  return [...totals.keys()]
    .sort()
    .map((month) => ({
      month,
      label: MONTH_LABELS[Number(month.slice(5, 7)) - 1] ?? month,
      total: totals.get(month) ?? 0,
    }))
}

import { LegalPage } from '@/features/legal/components'
import { TERMS_OF_SERVICE_CONTENT } from '@/features/legal/data/terms-of-service'

export function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" content={TERMS_OF_SERVICE_CONTENT} />
  )
}

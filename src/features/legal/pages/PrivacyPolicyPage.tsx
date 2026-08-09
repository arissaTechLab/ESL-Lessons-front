import { LegalPage } from '@/features/legal/components'
import { PRIVACY_POLICY_CONTENT } from '@/features/legal/data/privacy-policy'

export function PrivacyPolicyPage() {
  return <LegalPage title="Privacy Policy" content={PRIVACY_POLICY_CONTENT} />
}

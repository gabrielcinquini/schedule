import React from 'react'

import { ThermContent } from '@/components/therm-content'
import { getActiveRegisterConsentTherm } from '@/services/therms'

export const dynamic = 'force-dynamic'

export default async function RegisterThermContentPage() {
  const registerTherm = await getActiveRegisterConsentTherm()

  return <ThermContent therm={registerTherm} />
}

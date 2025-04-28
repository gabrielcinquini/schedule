import React from 'react'

import { getActiveRegisterConsentTherm } from '@/services/therms'

import { ThermContent } from '../_components/therm-content'

export const dynamic = 'force-dynamic'

export default async function RegisterThermContentPage() {
  const registerTherm = await getActiveRegisterConsentTherm()

  return <ThermContent therm={registerTherm} />
}

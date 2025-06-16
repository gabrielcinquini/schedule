import React from 'react'

import { ThermContent } from '@/components/therm-content'
import { getActiveRegisterPatientConsentTherm } from '@/services/therms'

export const dynamic = 'force-dynamic'

export default async function RegisterPatientThermPage() {
  const patientTherm = await getActiveRegisterPatientConsentTherm()

  return <ThermContent therm={patientTherm} />
}

import React from 'react'

import { getActiveRegisterPatientConsentTherm } from '@/services/therms'

import { ThermContent } from '../_components/therm-content'

export const dynamic = 'force-dynamic'

export default async function RegisterPatientThermPage() {
  const patientTherm = await getActiveRegisterPatientConsentTherm()

  return <ThermContent therm={patientTherm} />
}

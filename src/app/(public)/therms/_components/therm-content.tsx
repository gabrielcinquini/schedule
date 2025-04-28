'use server'

import { CpfConsent, RegisterConsent } from '@prisma/client'
import React from 'react'

interface ThermContentProps {
  therm: RegisterConsent | CpfConsent
}

export async function ThermContent({ therm }: ThermContentProps) {
  const processedText = therm.consent_text.replace(/\\n\\n/g, '\n\n')

  return (
    <div className="container flex flex-col items-center justify-center gap-10 py-10">
      <strong>{therm.consent_title}</strong>
      <div>
        {processedText.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}

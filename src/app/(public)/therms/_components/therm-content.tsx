'use server'

import React from 'react'

import { getActiveConsentTherm } from '@/services/therms'

export async function ThermContent() {
  const therm = await getActiveConsentTherm()

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

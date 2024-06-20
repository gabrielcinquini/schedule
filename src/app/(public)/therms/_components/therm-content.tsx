'use client'

import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { useRegisterPatientTherm } from '@/hooks/Therms/useRegisterPatientTherm'

export function ThermContent() {
  const { data: therm, isLoading } = useRegisterPatientTherm()

  return (
    <div className="container flex flex-col items-center justify-center gap-10 py-10">
      {isLoading ? (
        <>
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-48 w-full" />
        </>
      ) : (
        <>
          <strong>{therm?.consent_title}</strong>
          <p>{therm?.consent_text}</p>
        </>
      )}
    </div>
  )
}

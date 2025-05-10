'use client'

import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { usePatients } from '@/hooks/Patients/usePatients'
import { useSumSchedules } from '@/hooks/Schedule/useSumSchedules'
import { useGraphStore } from '@/store'

import { HeaderCard } from './HeaderCard'

export function Header() {
  const { totalSessions, totalValue, isLoadingGraph } = useGraphStore()

  const { data: sumSchedules, isLoading: isLoadingSumSchedules } =
    useSumSchedules()
  const { data, isLoading: isLoadingPatients } = usePatients()

  const isLoading = isLoadingSumSchedules || isLoadingPatients

  return (
    <div className="grid gap-4 max-xl:grid-cols-2 xl:grid-cols-4">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))
      ) : (
        <>
          <HeaderCard
            title="Total de Pacientes"
            type="number"
            value={data?.patients.length || 0}
          />
          {isLoadingGraph ? (
            Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full" />
            ))
          ) : (
            <>
              <HeaderCard
                title="Total de Sessões"
                type="number"
                value={totalSessions}
              />
              <HeaderCard
                title="Valor Total"
                type="currency"
                value={totalValue}
              />
            </>
          )}
          <HeaderCard
            title="Média por Sessão"
            type="currency"
            value={sumSchedules?.average || 0}
          />
        </>
      )}
    </div>
  )
}

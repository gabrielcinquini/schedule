'use client'

import React from 'react'

import CardInfo from '@/components/CardInfo'
import ModeToggle from '@/components/ui/mode-toggle'
import { Skeleton } from '@/components/ui/skeleton'
import { useSchedules } from '@/hooks/Schedule/useSchedules'
import { calcularTotal } from '@/utils/utils'

export function HeaderTotal() {
  const { data: completedSchedules, isLoading: isLoadingCompletedSchedules } =
    useSchedules('COMPLETED')
  const { data: canceledSchedules, isLoading: isLoadingCanceledSchedules } =
    useSchedules('CANCELED')

  const isLoading = isLoadingCompletedSchedules || isLoadingCanceledSchedules

  return (
    <header className="border-b border-border/40 max-sm:h-1/6 max-sm:px-4 max-sm:py-2 md:px-12 md:py-8 lg:px-32 lg:py-6">
      <div className="container flex justify-between gap-4">
        <h1 className="text-3xl font-bold max-sm:text-xl">Total</h1>
        {isLoading ? (
          <div className="flex h-full w-full justify-center gap-2">
            <Skeleton className="h-32 w-1/4" />
            <Skeleton className="h-32 w-1/4" />
          </div>
        ) : (
          <CardInfo
            currentPage="total"
            totalReceived={calcularTotal(completedSchedules)}
            totalNotReceived={calcularTotal(canceledSchedules)}
          />
        )}
        <ModeToggle />
      </div>
    </header>
  )
}

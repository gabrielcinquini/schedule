'use client'

import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { useSchedules } from '@/hooks/Schedule/useSchedules'
import { APP_ROUTES } from '@/routes/paths'
import { calcularTotal } from '@/utils/utils'

import { CardInfo } from '../../_components/card-info'
import { Widget } from '../../_components/widget'

export function HeaderTotal() {
  const { data: completedSchedules, isLoading: isLoadingCompletedSchedules } =
    useSchedules('COMPLETED')
  const { data: canceledSchedules, isLoading: isLoadingCanceledSchedules } =
    useSchedules('CANCELED')

  const isLoading = isLoadingCompletedSchedules || isLoadingCanceledSchedules

  return (
    <Widget title="Total">
      {isLoading ? (
        <div className="flex h-full w-full justify-center gap-2">
          <Skeleton className="h-32 w-1/4" />
          <Skeleton className="h-32 w-1/4" />
        </div>
      ) : (
        <>
          <CardInfo
            currentPage={APP_ROUTES.private.total}
            totalReceived={calcularTotal(completedSchedules)}
            totalNotReceived={calcularTotal(canceledSchedules)}
          />
        </>
      )}
    </Widget>
  )
}

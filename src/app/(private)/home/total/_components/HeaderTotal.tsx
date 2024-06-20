'use client'

import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { useSumSchedules } from '@/hooks/Schedule/useSumSchedules'
import { APP_ROUTES } from '@/routes/paths'

import { CardInfo } from '../../_components/card-info'
import { Widget } from '../../_components/widget'

export function HeaderTotal() {
  const { data, isLoading } = useSumSchedules()

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
            totalReceived={data?.completed}
            totalNotReceived={data?.canceled}
          />
        </>
      )}
    </Widget>
  )
}

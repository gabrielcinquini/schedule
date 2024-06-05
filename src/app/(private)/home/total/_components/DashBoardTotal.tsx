'use client'

import React from 'react'

import { useSchedules } from '@/hooks/Schedule/useSchedules'

import { PaginatedTable } from '../../_components/paginated-table'
import { TotalItemsList } from './TotalItemsList'

export function DashBoardTotal() {
  const { data: completedSchedules, isLoading: isLoadingCompletedSchedules } =
    useSchedules('COMPLETED')
  const { data: canceledSchedules, isLoading: isLoadingCanceledSchedules } =
    useSchedules('CANCELED')

  const isLoading = isLoadingCompletedSchedules || isLoadingCanceledSchedules

  const totalItems = [
    ...(completedSchedules ?? []),
    ...(canceledSchedules ?? []),
  ]

  return (
    <PaginatedTable
      data={totalItems}
      isLoading={isLoading}
      columns={['Nome', 'Data', 'Hora', 'Valor', '']}
      renderRow={(data) => <TotalItemsList totalItems={data} />}
      filterPlaceholder="Filtrar por nome"
      tableCaption="Sua agenda"
    />
  )
}

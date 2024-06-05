'use client'

import { useSchedules } from '@/hooks/Schedule/useSchedules'

import { PaginatedTable } from '../../_components/paginated-table'
import { SchedulesList } from './SchedulesList'

export function DashboardSchedule() {
  const { data: schedules, isLoading } = useSchedules('PENDING')

  return (
    <PaginatedTable
      data={schedules}
      isLoading={isLoading}
      columns={['Nome', 'Data', 'Hora', 'Valor', '']}
      renderRow={(data) => <SchedulesList schedules={data} />}
      filterPlaceholder="Filtrar por nome"
      tableCaption="Sua agenda"
    />
  )
}

'use client'

import { usePatients } from '@/hooks/Patients/usePatients'

import { PaginatedTable } from '../../_components/paginated-table'
import { PatientsList } from './PatientsList'

export function DashboardPatients() {
  const { data: patients, isLoading } = usePatients()

  return (
    <PaginatedTable
      data={patients}
      isLoading={isLoading}
      columns={['Nome', 'Convênio', 'Última Consulta', '']}
      renderRow={(data) => <PatientsList patients={data} />}
      filterPlaceholder="Filtrar por nome"
      tableCaption="Sua agenda"
    />
  )
}

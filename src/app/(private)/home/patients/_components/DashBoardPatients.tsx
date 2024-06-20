'use client'

import { useState } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { usePatients } from '@/hooks/Patients/usePatients'

import { Pagination } from '../../_components/pagination'
import { PatientsList } from './PatientsList'

export function DashboardPatients() {
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 5

  const { data, isLoading } = usePatients(currentPage, itemsPerPage)

  return (
    <div className="flex flex-col gap-2 sm:container">
      <Table>
        <TableCaption className="max-sm:hidden">Seus pacientes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Convênio</TableHead>
            <TableHead>Última Consulta</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={5}>
                  <Skeleton className="h-10" />
                </TableCell>
              </TableRow>
            ))}
          {!isLoading && <PatientsList patients={data?.patients} />}
        </TableBody>
      </Table>

      <Pagination
        lastPage={data?.totalPages}
        currentPage={currentPage}
        siblingsCount={1}
        onPageChange={(page) => setCurrentPage(page)}
        pageSize={itemsPerPage}
        totalCount={data?.totalCount}
      />
    </div>
  )
}

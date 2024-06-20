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
import { useSchedules } from '@/hooks/Schedule/useSchedules'

import { Pagination } from '../../_components/pagination'
import { SchedulesList } from './SchedulesList'

export function DashboardSchedule() {
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 5

  const { data, isLoading } = useSchedules(
    ['PENDING'],
    currentPage,
    itemsPerPage,
  )

  return (
    <div className="container">
      <Table>
        <TableCaption>Sua agenda</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Valor</TableHead>
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
          {!isLoading && <SchedulesList schedules={data?.schedules} />}
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

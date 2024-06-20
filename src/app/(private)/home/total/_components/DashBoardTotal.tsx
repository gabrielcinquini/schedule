'use client'

import React, { useState } from 'react'

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
import { TotalItemsList } from './TotalItemsList'

export function DashBoardTotal() {
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 5

  const { data, isLoading } = useSchedules(
    ['COMPLETED', 'CANCELED'],
    currentPage,
    itemsPerPage,
  )

  return (
    <div className="sm:container">
      <Table>
        <TableCaption>Total</TableCaption>
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
          {!isLoading && <TotalItemsList totalItems={data?.schedules} />}
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

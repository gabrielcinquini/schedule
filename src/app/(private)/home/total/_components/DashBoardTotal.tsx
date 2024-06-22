'use client'

import React, { useState } from 'react'

import { Input } from '@/components/ui/input'
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
import { useDebounce } from '@/hooks/useDebounce'

import { Pagination } from '../../_components/pagination'
import { TotalItemsList } from './TotalItemsList'

export function DashBoardTotal() {
  const [currentPage, setCurrentPage] = useState(1)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const itemsPerPage = 5

  const { data, isLoading } = useSchedules(
    ['COMPLETED', 'CANCELED'],
    currentPage,
    itemsPerPage,
    debouncedSearch,
  )

  return (
    <div className="sm:container">
      {!!data?.totalCount && (
        <Input
          placeholder="Pesquise pelo nome"
          className="mt-2 w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}
      <Table>
        {data?.totalCount ? (
          <TableCaption className="max-sm:hidden">
            Suas consultas realizadas ou desmarcadas.
          </TableCaption>
        ) : (
          <>
            <TableCaption>
              Você não tem consultas que foram realizadas ou desmarcadas.
            </TableCaption>
          </>
        )}
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

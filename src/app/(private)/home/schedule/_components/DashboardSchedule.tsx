'use client'

import { useState } from 'react'

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
import { SchedulesList } from './SchedulesList'

export function DashboardSchedule() {
  const [currentPage, setCurrentPage] = useState(1)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const itemsPerPage = 5

  const { data, isLoading } = useSchedules(
    ['PENDING'],
    currentPage,
    itemsPerPage,
    debouncedSearch,
  )

  return (
    <div className="flex flex-col gap-2 sm:container">
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
          <TableCaption className="max-sm:hidden">Sua agenda</TableCaption>
        ) : (
          <>
            <TableCaption>
              Sua agenda parece estar vazia, agende uma consulta com um paciente
            </TableCaption>
          </>
        )}
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="max-sm:hidden">Hora</TableHead>
            <TableHead className="max-sm:hidden">Valor</TableHead>
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

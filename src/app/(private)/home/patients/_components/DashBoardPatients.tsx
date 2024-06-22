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
import { usePatients } from '@/hooks/Patients/usePatients'
import { useDebounce } from '@/hooks/useDebounce'

import { Pagination } from '../../_components/pagination'
import { PatientsList } from './PatientsList'

export function DashboardPatients() {
  const [currentPage, setCurrentPage] = useState(1)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const itemsPerPage = 5

  const { data, isLoading } = usePatients(
    currentPage,
    itemsPerPage,
    debouncedSearch,
  )

  return (
    <div className="flex flex-col gap-2 sm:container">
      {!!data?.totalCount && (
        <Input
          placeholder="Pesquisar por nome ou CPF"
          className="mt-2 w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}
      <Table>
        {data?.totalCount ? (
          <TableCaption className="max-sm:hidden">Seus pacientes</TableCaption>
        ) : (
          <>
            <TableCaption>
              Você ainda não tem pacientes, cadastre um paciente
            </TableCaption>
          </>
        )}
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

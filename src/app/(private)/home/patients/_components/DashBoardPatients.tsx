'use client'

import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { usePatients } from '@/hooks/Patients/usePatients'
import { useDebounce } from '@/hooks/useDebounce'

import { Pagination } from '../../_components/pagination'
import { PatientsList } from './PatientsList'

export function DashboardPatients() {
  const [currentPage, setCurrentPage] = useState(1)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const itemsPerPage = 15

  const { data, isLoading } = usePatients(
    currentPage,
    itemsPerPage,
    debouncedSearch,
  )

  return (
    <div className="flex flex-col gap-8">
      {!!data?.totalCount && (
        <Input
          placeholder="Pesquisar por nome ou CPF"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}
      <div className="grid grid-cols-3 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1">
        {isLoading &&
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <Skeleton key={index} className="h-44 w-full" />
          ))}
        {!isLoading && <PatientsList patients={data?.patients} />}
      </div>

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

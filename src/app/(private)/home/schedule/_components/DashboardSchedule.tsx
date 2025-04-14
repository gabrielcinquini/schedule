'use client'

import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useSchedules } from '@/hooks/Schedule/useSchedules'
import { useDebounce } from '@/hooks/useDebounce'

import { Pagination } from '../../_components/pagination'
import { SearchCalendarModal } from './calendar/search-calendar-modal'
import { SchedulesList } from './SchedulesList'

export function DashboardSchedule() {
  const [currentPage, setCurrentPage] = useState(1)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const itemsPerPage = 15

  const { data, isLoading } = useSchedules(
    ['PENDING'],
    currentPage,
    itemsPerPage,
    debouncedSearch,
  )

  return (
    <div className="flex flex-col gap-8">
      {!!data?.totalCount && (
        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder="Pesquise pelo nome"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchCalendarModal />
        </div>
      )}
      <div className="grid grid-cols-3 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1">
        {isLoading &&
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <Skeleton key={index} className="h-44 w-full" />
          ))}
        {!isLoading && <SchedulesList schedules={data?.schedules} />}
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

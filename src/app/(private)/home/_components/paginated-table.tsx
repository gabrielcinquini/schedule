'use client'

import { ReactNode, useState } from 'react'

import { Button } from '@/components/ui/button'
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

// TODO: Refactor to use specific types instead of Generics Type

interface PaginatedTableProps<T> {
  data?: T[]
  isLoading: boolean
  columns: string[]
  renderRow: (item: T) => ReactNode
  filterPlaceholder: string
  tableCaption: string
}

export function PaginatedTable<T>({
  data,
  isLoading,
  columns,
  renderRow,
  filterPlaceholder,
  tableCaption,
}: PaginatedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState('')

  const itemsPerPage = 5

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const filteredData = data?.filter((item) => {
    // @ts-expect-error T type
    return Object.values(item).some((val) =>
      String(val).toLowerCase().includes(filter.toLowerCase()),
    )
  })

  const totalPages = filteredData
    ? filteredData.length > 0
      ? Math.ceil(filteredData.length / itemsPerPage)
      : 1
    : 1

  return (
    <div className="container">
      <Input
        type="text"
        placeholder={filterPlaceholder}
        value={filter}
        onChange={(e) => {
          setCurrentPage(1)
          setFilter(e.target.value)
        }}
        className="my-2 w-1/2 max-sm:w-full"
      />
      <Table>
        <TableCaption>{tableCaption}</TableCaption>
        <TableHeader>
          <TableRow>
            {columns.map((col, index) => (
              <TableHead key={index}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={columns.length}>
                  <Skeleton className="h-10" />
                </TableCell>
              </TableRow>
            ))}
          {/* @ts-expect-error T type */}
          {!isLoading && renderRow(filteredData?.slice(startIndex, endIndex))}
        </TableBody>
      </Table>
      <div className="flex gap-2 px-8">
        <Button
          onClick={() => {
            setCurrentPage(currentPage - 1)
          }}
          variant={'harderOutline'}
          disabled={currentPage === 1}
          className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
        >
          Anterior
        </Button>
        <span className="ml-4 mr-4 py-2">
          {currentPage}/{totalPages}
        </span>
        <Button
          onClick={() => {
            setCurrentPage(currentPage + 1)
          }}
          variant={'harderOutline'}
          disabled={currentPage === totalPages}
          className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
        >
          Próxima
        </Button>
      </div>
    </div>
  )
}

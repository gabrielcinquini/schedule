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

import { Button } from '../../../../../components/ui/button'
import { Input } from '../../../../../components/ui/input'
import { PatientsList } from './PatientsList'

export function DashboardPatients() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState('')

  const { data: patients, isLoading } = usePatients()

  const itemsPerPage = 5

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const filteredPatients = patients?.filter((patient) => {
    const fullName = `${patient.name} ${patient.lastName}`.toLowerCase()
    return fullName.includes(filter.toLowerCase())
  })

  const totalPages = filteredPatients
    ? filteredPatients.length > 0
      ? Math.ceil(filteredPatients.length / itemsPerPage)
      : 1
    : 1

  return (
    <div className="container">
      <Input
        type="text"
        placeholder="Filtrar por nome"
        value={filter}
        onChange={(e) => {
          setCurrentPage(1)
          setFilter(e.target.value)
        }}
        className="my-2 w-1/2 max-sm:w-full"
      />
      <Table>
        <TableCaption>Seus pacientes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Convênio</TableHead>
            <TableHead>Última Consulta</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={5}>
                  <Skeleton className="h-10" />
                </TableCell>
              </TableRow>
            ))}
          <PatientsList
            patients={filteredPatients}
            startIndex={startIndex}
            endIndex={endIndex}
          />
        </TableBody>
      </Table>
      <div className="flex gap-2 px-8">
        <Button
          onClick={() => {
            setCurrentPage(currentPage - 1)
          }}
          variant={'harderOutline'}
          disabled={currentPage <= 1}
          className={`${
            currentPage === 1 ? 'pointer-events-none opacity-50' : ''
          }`}
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
          disabled={currentPage >= totalPages}
          className={`${
            currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          Próxima
        </Button>
      </div>
    </div>
  )
}

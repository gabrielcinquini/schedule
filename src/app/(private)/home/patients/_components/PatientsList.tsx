import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { GripHorizontalIcon } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import { capitalize } from '@/utils/utils'
import { PatientType } from '@/validations/validations'

import { DropdownMenuContentPatients } from './DropdownMenuContentPatients'

interface PatientsListProps {
  patients?: PatientType[]
}

export function PatientsList({ patients }: PatientsListProps) {
  return (
    <>
      {patients?.map((patient) => (
        <TableRow key={patient.id}>
          <TableCell className="min-w-[150px]">{patient.name}</TableCell>
          <TableCell className="min-w-[130px]">{patient.cpf}</TableCell>
          <TableCell className="max-sm:hidden">{patient.convenio}</TableCell>
          <TableCell className="min-w-[200px] max-sm:hidden">
            {patient.lastConsult ? (
              <>
                {format(new Date(patient.lastConsult), 'dd/MM/yy')} -{' '}
                {capitalize(
                  format(new Date(patient.lastConsult), 'EE', {
                    locale: ptBR,
                  }),
                )}{' '}
                às{' '}
                {format(new Date(patient.lastConsult), 'HH:mm', {
                  locale: ptBR,
                })}
              </>
            ) : (
              'Ainda não consultou'
            )}
          </TableCell>
          <TableCell align="right" className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <GripHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContentPatients patient={patient} />
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

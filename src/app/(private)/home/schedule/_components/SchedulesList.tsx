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
import { ScheduleType } from '@/validations/validations'

import { DropdownMenuContentSchedule } from './DropdownMenuContentSchedule'

interface PatientsListProps {
  schedules?: ScheduleType[]
}

export function SchedulesList({ schedules }: PatientsListProps) {
  return (
    <>
      {schedules?.map((schedule) => (
        <TableRow key={schedule.id}>
          <TableCell className="min-w-[150px]">{schedule.name}</TableCell>
          <TableCell className="min-w-[150px]">
            {format(new Date(schedule.date), 'dd/MM/yy')} -{' '}
            {capitalize(
              format(new Date(schedule.date), 'EE', { locale: ptBR }),
            )}
          </TableCell>
          <TableCell className="max-sm:hidden">
            {format(new Date(schedule.date), 'HH:mm', { locale: ptBR })}
          </TableCell>
          <TableCell className="max-sm:hidden">
            {schedule.value === 0
              ? 'Isento'
              : new Intl.NumberFormat('pt-br', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(schedule.value)}
          </TableCell>
          <TableCell align="right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <GripHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContentSchedule schedule={schedule} />
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

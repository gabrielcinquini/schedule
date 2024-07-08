import clsx from 'clsx'
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

import { DropdownMenuContentTotal } from './DropdownMenuContentTotal'

interface TotalItemsListProps {
  totalItems?: ScheduleType[]
}

export function TotalItemsList({ totalItems }: TotalItemsListProps) {
  return (
    <>
      {totalItems?.map((service) => (
        <TableRow
          key={service.id}
          className={clsx(
            'hover:none',
            service.status === 'COMPLETED' && 'bg-green-700',
            service.status === 'CANCELED' && 'bg-destructive/70',
          )}
        >
          <TableCell className="min-w-[150px]">{service.name}</TableCell>
          <TableCell className="min-w-[140px]">
            {format(new Date(service.date), 'dd/MM/yy')} -{' '}
            {capitalize(
              format(new Date(service.date), 'EE', {
                locale: ptBR,
              }),
            )}
          </TableCell>
          <TableCell className="max-sm:hidden">
            {format(new Date(service.date), 'HH:mm', {
              locale: ptBR,
            })}
          </TableCell>
          <TableCell className="max-sm:hidden">
            {service.value === 0
              ? 'Isento'
              : new Intl.NumberFormat('pt-br', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(service.value)}
          </TableCell>
          <TableCell align="right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <GripHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContentTotal service={service} />
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

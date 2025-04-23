import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MenuIcon } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib'
import { capitalize } from '@/utils/utils'
import { PatientType, ScheduleType } from '@/validations/validations'

import { DropdownMenuContentTotal } from './DropdownMenuContentTotal'

interface TotalItemsListProps {
  totalItems?: (ScheduleType & { patient: Pick<PatientType, 'name'> })[]
}

export function TotalItemsList({ totalItems }: TotalItemsListProps) {
  return (
    <>
      {totalItems?.map((service) => (
        <Card
          key={service.id}
          className={cn(
            service.status === 'COMPLETED' && 'border-l-4 border-l-green-700',
            service.status === 'CANCELED' && 'border-l-4 border-l-destructive',
          )}
        >
          <CardHeader>
            <CardTitle className="flex w-full items-center justify-between">
              {service.patient.name}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="p-2" variant="ghost">
                    <MenuIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContentTotal service={service} />
              </DropdownMenu>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="flex gap-2">
              <span className="font-bold">Data:{`${' '}`}</span>
              <span className="text-muted-foreground">
                {format(new Date(service.date), 'dd/MM/yy')}
              </span>
            </p>
            <p className="flex gap-2">
              <span className="font-bold">Dia:{`${' '}`}</span>
              <span className="text-muted-foreground">
                {capitalize(
                  format(new Date(service.date), 'EE', { locale: ptBR }),
                )}
              </span>
            </p>
            <p>
              <span className="font-bold">Hora: {`${' '}`}</span>
              <span className="text-muted-foreground">
                {format(new Date(service.date), 'HH:mm', { locale: ptBR })}
              </span>
            </p>
            <p>
              <span className="font-bold">Valor: {`${' '}`}</span>
              <span className="text-muted-foreground">
                {service.value === 0
                  ? 'Isento'
                  : new Intl.NumberFormat('pt-br', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(service.value)}
              </span>
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

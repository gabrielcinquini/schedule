import clsx from 'clsx'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MenuIcon } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { capitalize } from '@/utils/utils'
import { ScheduleType } from '@/validations/validations'

import { DropdownMenuContentTotal } from './DropdownMenuContentTotal'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib'

interface TotalItemsListProps {
  totalItems?: ScheduleType[]
}

export function TotalItemsList({ totalItems }: TotalItemsListProps) {
  return (
    <>
      {totalItems?.map((service) => (
        <Card
          key={service.id}
          className={cn(
            service.status === 'COMPLETED' && 'border-l-green-700 border-l-4',
            service.status === 'CANCELED' && 'border-l-destructive border-l-4',
          )}
        >
          <CardHeader>
            <CardTitle className="flex w-full items-center justify-between">
              {service.name}
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
              <span className="font-bold">Data:{`${" "}`}</span>
              <span className="text-muted-foreground">
                {format(new Date(service.date), "dd/MM/yy")}
              </span>
            </p>
            <p className="flex gap-2">
              <span className="font-bold">Dia:{`${" "}`}</span>
              <span className="text-muted-foreground">
                {capitalize(
                  format(new Date(service.date), "EE", { locale: ptBR }),
                )}
              </span>
            </p>
            <p>
              <span className="font-bold">Hora: {`${" "}`}</span>
              <span className="text-muted-foreground">
                {format(new Date(service.date), "HH:mm", { locale: ptBR })}
              </span>
            </p>
            <p>
              <span className="font-bold">Valor: {`${" "}`}</span>
              <span className="text-muted-foreground">
                {service.value === 0
                  ? "Isento"
                  : new Intl.NumberFormat("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    }).format(service.value)}
              </span>
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

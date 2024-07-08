import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import React from 'react'

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { capitalize } from '@/utils/utils'
import { ScheduleType } from '@/validations/validations'

interface DialogContentScheduleProps {
  schedule: ScheduleType
}

export function DialogContentSchedule({
  schedule,
}: DialogContentScheduleProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Detalhes</DialogTitle>
        <DialogDescription>
          Detalhes do agendamento de {schedule.name}.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4 text-sm">
        <p className="flex gap-2">
          <span>Data:</span>
          <span className="text-muted-foreground">
            {format(new Date(schedule.date), 'dd/MM/yy')} -{' '}
            {capitalize(
              format(new Date(schedule.date), 'EE', {
                locale: ptBR,
              }),
            )}
          </span>
        </p>
        <p className="flex gap-2">
          <span>Hora:</span>
          <span className="text-muted-foreground">
            {format(new Date(schedule.date), 'HH:mm', {
              locale: ptBR,
            })}
          </span>
        </p>
        <p className="flex gap-2">
          <span>Valor:</span>
          <span className="text-muted-foreground">
            {schedule.value === 0
              ? 'Isento'
              : new Intl.NumberFormat('pt-br', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(schedule.value)}
          </span>
        </p>
      </div>
    </DialogContent>
  )
}

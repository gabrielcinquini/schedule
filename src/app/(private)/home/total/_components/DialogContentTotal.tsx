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

interface DialogContentTotalProps {
  service: ScheduleType
}

export function DialogContentTotal({ service }: DialogContentTotalProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Detalhes</DialogTitle>
        <DialogDescription>
          Detalhes da consulta de {service.name}.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4 text-sm">
        <p className="flex gap-2">
          <span>Data:</span>
          <span className="text-muted-foreground">
            {format(new Date(service.date), 'dd/MM/yy')} -{' '}
            {capitalize(
              format(new Date(service.date), 'EE', {
                locale: ptBR,
              }),
            )}
          </span>
        </p>
        <p className="flex gap-2">
          <span>Hora:</span>
          <span className="text-muted-foreground">
            {format(new Date(service.date), 'HH:mm', {
              locale: ptBR,
            })}
          </span>
        </p>
        <p className="flex gap-2">
          <span>Valor:</span>
          <span className="text-muted-foreground">
            {service.value === 0
              ? 'Isento'
              : new Intl.NumberFormat('pt-br', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(service.value)}
          </span>
        </p>
        <p className="flex gap-2">
          <span>Status:</span>
          <span className="text-muted-foreground">
            {service.status === 'COMPLETED' ? 'Concluído' : 'Cancelado'}
          </span>
        </p>
      </div>
    </DialogContent>
  )
}

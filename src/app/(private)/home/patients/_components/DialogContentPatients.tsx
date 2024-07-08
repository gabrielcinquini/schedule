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
import { PatientType } from '@/validations/validations'

interface DialogContentPatientsProps {
  patient: PatientType
}

export function DialogContentPatients({ patient }: DialogContentPatientsProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Detalhes</DialogTitle>
        <DialogDescription>
          Detalhes do paciente {patient.name}.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4 text-sm">
        <p className="flex gap-2">
          <span>CPF:</span>
          <span className="text-muted-foreground">{patient.cpf}</span>
        </p>
        <p className="flex gap-2">
          <span>Convênio:</span>
          <span className="text-muted-foreground">{patient.convenio}</span>
        </p>
        <p className="flex gap-2">
          <span>Última Consulta:</span>
          <span className="text-muted-foreground">
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
          </span>
        </p>
      </div>
    </DialogContent>
  )
}

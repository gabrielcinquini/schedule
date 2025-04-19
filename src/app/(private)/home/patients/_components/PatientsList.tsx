import { Patient } from '@prisma/client'
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
import { capitalize } from '@/utils/utils'

import { DropdownMenuContentPatients } from './DropdownMenuContentPatients'

interface PatientsListProps {
  patients?: Patient[]
}

export function PatientsList({ patients }: PatientsListProps) {
  return (
    <>
      {patients?.map((patient) => (
        <Card key={patient.id}>
          <CardHeader>
            <CardTitle className="flex w-full items-center justify-between">
              {patient.name}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="p-2" variant="ghost">
                    <MenuIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContentPatients patient={patient} />
              </DropdownMenu>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="flex gap-2">
              <span className="font-bold">Nome:{`${' '}`}</span>
              <span className="text-muted-foreground">{patient.name}</span>
            </p>
            <p className="flex gap-2">
              <span className="font-bold">CPF:{`${' '}`}</span>
              <span className="text-muted-foreground">
                {patient.cpf ? patient.cpf : 'Não informado'}
              </span>
            </p>
            <p>
              <span className="font-bold">Convênio: {`${' '}`}</span>
              <span className="text-muted-foreground">{patient.convenio}</span>
            </p>
            <p>
              <span className="font-bold">Última consulta: {`${' '}`}</span>
              <span className="text-muted-foreground">
                {patient.lastConsult
                  ? format(new Date(patient.lastConsult), 'dd/MM/yy')
                  : 'Ainda não consultou'}
              </span>
            </p>
            {patient.lastConsult && (
              <>
                <p>
                  <span className="font-bold">Dia: {`${' '}`}</span>
                  <span className="text-muted-foreground">
                    {capitalize(
                      format(new Date(patient.lastConsult), 'EE', {
                        locale: ptBR,
                      }),
                    )}
                  </span>
                </p>
                <p>
                  <span className="font-bold">Hora: {`${' '}`}</span>
                  <span className="text-muted-foreground">
                    {format(new Date(patient.lastConsult), 'HH:mm', {
                      locale: ptBR,
                    })}
                  </span>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  )
}

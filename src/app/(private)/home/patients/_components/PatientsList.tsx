import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash2 } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { useDeletePatient } from '@/hooks/Patients/deletePatient'
import { capitalize } from '@/utils/utils'
import { PatientType } from '@/validations/validations'

import { Confirmation } from '../../_components/confirmation'

interface PatientsListProps {
  patients?: PatientType[]
}

export function PatientsList({ patients }: PatientsListProps) {
  const { mutateAsync: onDeletePatient, isPending } = useDeletePatient()

  const handleDelete = async (id: string) => {
    await onDeletePatient(id)
  }

  return (
    <>
      {patients?.map((patient) => (
        <TableRow key={patient.id}>
          <TableCell className="min-w-[150px]">{patient.name}</TableCell>
          <TableCell className="min-w-[130px]">{patient.cpf}</TableCell>
          <TableCell>{patient.convenio}</TableCell>
          <TableCell className="min-w-[200px]">
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
            <Confirmation
              text={`Deseja deletar o paciente ${patient.name}?`}
              description="Essa ação não pode ser desfeita. Isso deleterá permanentemente esse paciente dos nossos servidores."
              fn={() => {
                toast.promise(handleDelete(patient.id), {
                  loading: 'Deletando...',
                })
              }}
            >
              <Button
                variant={'destructive'}
                className="rounded-md bg-red-700 p-2 transition-all duration-200 hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50 max-sm:p-1"
                disabled={isPending}
              >
                <Trash2 />
              </Button>
            </Confirmation>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

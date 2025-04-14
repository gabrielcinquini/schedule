import { Trash2Icon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  DropdownMenuContent,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import { useDeletePatient } from '@/hooks/Patients/deletePatient'
import { PatientType } from '@/validations/validations'

import { Confirmation } from '../../_components/confirmation'

interface DropdownMenuContentPatientsProps {
  patient: PatientType
}

export function DropdownMenuContentPatients({
  patient,
}: DropdownMenuContentPatientsProps) {
  const { mutateAsync: onDeletePatient, isPending } = useDeletePatient()

  const handleDelete = async (id: string) => {
    await onDeletePatient(id)
  }

  return (
    <DropdownMenuContent>
      <DropdownMenuGroup>
        <Confirmation
          text={`Deseja deletar o paciente ${patient.name}?`}
          description="Essa ação não pode ser desfeita. Isso deleterá permanentemente esse paciente dos nossos servidores."
          fn={() => {
            toast.promise(handleDelete(patient.id), {
              loading: 'Deletando...',
            })
          }}
        >
          <Button variant="ghost" disabled={isPending}>
            <div className="flex items-center">
              <Trash2Icon className="mr-2" />
              Deletar
            </div>
          </Button>
        </Confirmation>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  )
}

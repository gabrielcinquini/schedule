import { Patient } from '@prisma/client'
import { EditIcon, Trash2Icon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenuContent,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import { useDeletePatient } from '@/hooks/Patients/deletePatient'

import { Confirmation } from '../../_components/confirmation'
import { UpdatePatientForm } from './UpdatePatientForm'

interface DropdownMenuContentPatientsProps {
  patient: Patient
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
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="flex w-full items-center justify-start gap-2"
              disabled={isPending}
            >
              <EditIcon />
              Editar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar paciente</DialogTitle>
              <DialogDescription>
                Preencha os campos para editar o paciente
              </DialogDescription>
            </DialogHeader>
            <UpdatePatientForm patient={patient} />
          </DialogContent>
        </Dialog>
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
            variant="ghost"
            className="flex w-full items-center justify-start gap-2"
            disabled={isPending}
          >
            <Trash2Icon />
            Deletar
          </Button>
        </Confirmation>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  )
}

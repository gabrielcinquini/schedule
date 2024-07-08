import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { LibraryIcon, Trash2Icon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useDeleteSchedule } from '@/hooks/Schedule/deleteSchedule'
import { capitalize } from '@/utils/utils'
import { ScheduleType } from '@/validations/validations'

import { Confirmation } from '../../_components/confirmation'
import { DialogContentTotal } from './DialogContentTotal'

interface DropdownMenuContentTotalProps {
  service: ScheduleType
}

export function DropdownMenuContentTotal({
  service,
}: DropdownMenuContentTotalProps) {
  const { mutateAsync: onDeleteSchedule, isPending } = useDeleteSchedule()

  const handleDelete = async (id: string) => {
    await onDeleteSchedule(id)
  }

  return (
    <DropdownMenuContent>
      <DropdownMenuLabel>Detalhes</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="sm:hidden">
              <LibraryIcon className="mr-2" /> Detalhes
            </Button>
          </DialogTrigger>
          <DialogContentTotal service={service} />
        </Dialog>
      </DropdownMenuGroup>
      <DropdownMenuSeparator className="sm:hidden" />
      <DropdownMenuGroup>
        <Confirmation
          text={`Deseja deletar o registro da consulta com ${
            service.name
          } marcada para às ${format(new Date(service.date), 'HH:mm', {
            locale: ptBR,
          })} do dia ${format(new Date(service.date), 'dd/MM/yy')} -
              ${capitalize(
                format(new Date(service.date), 'EE', { locale: ptBR }),
              )}?`}
          description="Essa ação não pode ser desfeita. Isso deleterá permanentemente esse
              registro de consulta dos nossos servidores."
          fn={() => {
            toast.promise(handleDelete(service.id), {
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

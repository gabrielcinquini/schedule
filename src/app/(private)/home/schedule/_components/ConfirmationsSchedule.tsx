import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CheckSquareIcon, Trash2Icon, XSquareIcon } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { capitalize } from '@/utils/utils'
import { ScheduleType } from '@/validations/validations'

import { Confirmation } from '../../_components/confirmation'

interface ConfirmationsScheduleProps {
  schedule: ScheduleType
  handleComplete: (schedule: ScheduleType) => Promise<void>
  handleNotComplete: (schedule: ScheduleType) => Promise<void>
  handleDelete: (id: string, deleteAllFuture: boolean) => Promise<void>
  isPending: boolean
}

export function ConfirmationsSchedule({
  schedule,
  handleComplete,
  handleNotComplete,
  handleDelete,
  isPending,
}: ConfirmationsScheduleProps) {
  const [deleteAllFuture, setDeleteAllFuture] = useState(false)

  return (
    <>
      <Confirmation
        text={`A consulta com ${schedule.name} marcada para às ${format(
          new Date(schedule.date),
          'HH:mm',
          {
            locale: ptBR,
          },
        )} do dia ${format(new Date(schedule.date), 'dd/MM/yy')} -
                ${capitalize(
                  format(new Date(schedule.date), 'EE', { locale: ptBR }),
                )} foi realizada?`}
        description={`Essa consulta será movida para o seu TOTAL como: 'Consulta Realizada'`}
        fn={() => {
          toast.promise(handleComplete(schedule), {
            loading: 'Movendo para as consultas realizadas...',
          })
        }}
      >
        <Button variant="ghost" disabled={isPending} className="flex">
          <CheckSquareIcon className="mr-2" />
          Concluir Sessão
        </Button>
      </Confirmation>

      <Confirmation
        text={`A consulta com ${schedule.name} marcada para às ${format(
          new Date(schedule.date),
          'HH:mm',
          {
            locale: ptBR,
          },
        )} do dia ${format(new Date(schedule.date), 'dd/MM/yy')} -
                ${capitalize(
                  format(new Date(schedule.date), 'EE', { locale: ptBR }),
                )} foi desmarcada?`}
        description={`Essa consulta será movida para o seu TOTAL como: 'Consulta Desmarcada'`}
        fn={() => {
          toast.promise(handleNotComplete(schedule), {
            loading: 'Movendo para as consultas não realizadas...',
          })
        }}
      >
        <Button variant="ghost" disabled={isPending} className="flex">
          <XSquareIcon className="mr-2" />
          Desmarcar Sessão
        </Button>
      </Confirmation>

      <Confirmation
        text={`Deseja deletar a consulta com ${schedule.name} marcada para às ${format(
          new Date(schedule.date),
          'HH:mm',
          {
            locale: ptBR,
          },
        )} do dia ${format(new Date(schedule.date), 'dd/MM/yy')} -
                ${capitalize(
                  format(new Date(schedule.date), 'EE', { locale: ptBR }),
                )}?`}
        description={`Essa ação não pode ser desfeita. Isso deleterá permanentemente esse
              agendamento dos nossos servidores.`}
        fn={() => {
          toast.promise(handleDelete(schedule.id, deleteAllFuture), {
            loading: 'Deletando...',
          })
        }}
        additionalContent={
          <div className="mt-4 text-start">
            <RadioGroup
              value={deleteAllFuture ? 'all' : 'single'}
              onValueChange={(value) => setDeleteAllFuture(value === 'all')}
              className="flex flex-col gap-2"
            >
              <div className="space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single">Deletar apenas esta sessão</Label>
              </div>
              <div className="space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">
                  Deletar esta sessão e todas as posteriores deste paciente
                </Label>
              </div>
            </RadioGroup>
          </div>
        }
      >
        <Button variant="ghost" disabled={isPending} className="flex">
          <Trash2Icon className="mr-2" />
          Deletar Sessão
        </Button>
      </Confirmation>
    </>
  )
}

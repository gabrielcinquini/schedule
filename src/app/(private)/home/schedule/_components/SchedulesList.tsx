import { TableRow, TableCell } from '@/components/ui/table';
import { ScheduleType } from '@/validations/validations';
import { CheckSquare, Trash2, XSquare } from 'lucide-react';
import React from 'react'
import { Button } from '@/components/ui/button';
import { useDeleteSchedule } from '@/hooks/Schedule/deleteSchedule';
import Confirmation from '@/components/Confirmation';
import { capitalize } from '@/utils/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { useChangeScheduleStatus } from '@/hooks/Schedule/changeScheduleStatus';

interface PatientsListProps {
  schedules?: ScheduleType[];
  startIndex: number;
  endIndex: number;
}

export function SchedulesList({ schedules, startIndex, endIndex }: PatientsListProps) {
  const { mutateAsync: onDeleteSchedule, isPending } = useDeleteSchedule();
  const { mutateAsync: onChangeScheduleStatus } = useChangeScheduleStatus();

  const handleDelete = async (id: string) => {
    await onDeleteSchedule(id);
  };

  const handleComplete = async (schedule: ScheduleType) => {
    await onChangeScheduleStatus({ id: schedule.id, status: "COMPLETED", date: schedule.date });
  };

  const handleNotComplete = async (schedule: ScheduleType) => {
    await onChangeScheduleStatus({ id: schedule.id, status: "CANCELED", date: schedule.date });
  };

  return (
    <>
      {schedules?.slice(startIndex, endIndex).map((schedule) => (
        <TableRow key={schedule.id}>
        <TableCell>
          {schedule.name} {schedule.lastName}
        </TableCell>
        <TableCell>
          {format(new Date(schedule.date), "dd/MM/yy")} -{" "}
          {capitalize(
            format(new Date(schedule.date), "EE", { locale: ptBR })
          )}
        </TableCell>
        <TableCell>
          {format(new Date(schedule.date), "HH:mm", { locale: ptBR })}
        </TableCell>
        <TableCell>
          {schedule.value === 0
            ? "Isento"
            : new Intl.NumberFormat("pt-br", {
                style: "currency",
                currency: "BRL",
              }).format(schedule.value)}
        </TableCell>
        <TableCell align="right">
          <div className="flex">
            <Confirmation
              text={`A consulta com ${schedule.name} ${
                schedule.lastName
              } marcada para às ${format(
                new Date(schedule.date),
                "HH:mm",
                { locale: ptBR }
              )} do dia ${format(
                new Date(schedule.date),
                "dd/MM/yy"
              )} -
              ${capitalize(
                format(new Date(schedule.date), "EE", { locale: ptBR })
              )} foi realizada?`}
              description={`Essa consulta será movida para o seu TOTAL como: 'Consulta Realizada'`}
              fn={() => {
                toast.promise(handleComplete(schedule), { loading: "Movendo para as consultas realizadas..." });
              }}
            >
              <Button className="bg-green-600 p-2 rounded-md mr-2 hover:bg-green-800 transition-all duration-200 max-sm:p-1" disabled={isPending}>
                <CheckSquare />
              </Button>
            </Confirmation>

            <Confirmation
              text={`A consulta com ${schedule.name} ${
                schedule.lastName
              } marcada para às ${format(
                new Date(schedule.date),
                "HH:mm",
                { locale: ptBR }
              )} do dia ${format(
                new Date(schedule.date),
                "dd/MM/yy"
              )} -
              ${capitalize(
                format(new Date(schedule.date), "EE", { locale: ptBR })
              )} foi desmarcada?`}
              description={`Essa consulta será movida para o seu TOTAL como: 'Consulta Desmarcada'`}
              fn={() => {
                toast.promise(handleNotComplete(schedule), { loading: "Movendo para as consultas não realizadas..." });
              }}
            >
              <Button className="bg-orange-400 p-2 rounded-md mr-2 hover:bg-orange-500 transition-all duration-200 max-sm:p-1" disabled={isPending}>
                <XSquare />
              </Button>
            </Confirmation>

            <Confirmation
              text={`Deseja deletar a consulta com ${schedule.name} ${
                schedule.lastName
              } marcada para às ${format(
                new Date(schedule.date),
                "HH:mm",
                { locale: ptBR }
              )} do dia ${format(
                new Date(schedule.date),
                "dd/MM/yy"
              )} -
              ${capitalize(
                format(new Date(schedule.date), "EE", { locale: ptBR })
              )}?`}
              description={`Essa ação não pode ser desfeita. Isso deleterá permanentemente esse
            agendamento dos nossos servidores.`}
              fn={() => {
                toast.promise(handleDelete(schedule.id), { loading: "Deletando..." });
              }}
            >
              <Button className="bg-red-700 p-2 rounded-md hover:bg-red-900 transition-all duration-200 max-sm:p-1" disabled={isPending}>
                <Trash2 />
              </Button>
            </Confirmation>
          </div>
        </TableCell>
      </TableRow>
      ))}
    </>
  )
}

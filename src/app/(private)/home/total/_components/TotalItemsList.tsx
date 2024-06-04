import { TableRow, TableCell } from '@/components/ui/table';
import { ScheduleType } from '@/validations/validations';
import { Trash2 } from 'lucide-react';
import React from 'react'
import { Button } from '@/components/ui/button';
import { useDeleteSchedule } from '@/hooks/Schedule/deleteSchedule';
import Confirmation from '@/components/Confirmation';
import { capitalize } from '@/utils/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import clsx from 'clsx';

interface TotalItemsListProps {
  totalItems?: ScheduleType[];
  startIndex: number;
  endIndex: number;
}

export function TotalItemsList({ totalItems, startIndex, endIndex }: TotalItemsListProps) {
  const { mutateAsync: onDeleteSchedule, isPending } = useDeleteSchedule();

  const handleDelete = async (id: string) => {
    await onDeleteSchedule(id);
  };

  return (
    <>
      {totalItems?.slice(startIndex, endIndex).map((service, index) => (
        <TableRow
          key={service.id}
          className={clsx('hover:none', service.status === 'COMPLETED' && 'bg-green-700', service.status === 'CANCELED' && 'bg-destructive/70')}
        >
          <TableCell>
            {service.name} {service.lastName}
          </TableCell>
          <TableCell>
            {format(new Date(service.date), "dd/MM/yy")} -{" "}
            {capitalize(
              format(new Date(service.date), "EE", {
                locale: ptBR,
              })
            )}
          </TableCell>
          <TableCell>
            {format(new Date(service.date), "HH:mm", {
              locale: ptBR,
            })}
          </TableCell>
          <TableCell>
            {service.value === 0
              ? "Isento"
              : new Intl.NumberFormat("pt-br", {
                  style: "currency",
                  currency: "BRL",
                }).format(service.value)}
          </TableCell>
          <TableCell align="right">
            <Confirmation
              text={`Deseja deletar o registro da consulta com ${
                service.name
              } ${service.lastName} marcada para às ${format(
                new Date(service.date),
                "HH:mm",
                { locale: ptBR }
              )} do dia ${format(new Date(service.date), "dd/MM/yy")} -
              ${capitalize(
                format(new Date(service.date), "EE", { locale: ptBR })
              )}?`}
              description="Essa ação não pode ser desfeita. Isso deleterá permanentemente esse
              registro de consulta dos nossos servidores."
              fn={() => {
                toast.promise(handleDelete(service.id), { loading: "Deletando..." });
              }}
            >
              <Button
                variant="ghost"
                className="p-2 rounded-md transition-all duration-200 max-sm:p-1"
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
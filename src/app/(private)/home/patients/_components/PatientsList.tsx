import Confirmation from '@/components/Confirmation';
import { TableRow, TableCell } from '@/components/ui/table';
import { capitalize } from '@/utils/utils';
import { PatientType } from '@/validations/validations';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import React from 'react'
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useDeletePatient } from '@/hooks/Patients/deletePatient';

interface PatientsListProps {
  patients?: PatientType[];
  startIndex: number;
  endIndex: number;
}

export function PatientsList({ patients, startIndex, endIndex }: PatientsListProps) {
  const { mutateAsync: onDeletePatient, isPending } = useDeletePatient();

  const handleDelete = async (id: string) => {
    await onDeletePatient(id);
  };

  return (
    <>
      {patients?.slice(startIndex, endIndex).map((patient) => (
        <TableRow key={patient.id}>
          <TableCell>
            {patient.name} {patient.lastName}
          </TableCell>
          <TableCell>{patient.convenio}</TableCell>
          <TableCell>
            {patient.lastConsult ? (
              <>
                {format(new Date(patient.lastConsult), "dd/MM/yy")} -{" "}
                {capitalize(
                  format(new Date(patient.lastConsult), "EE", {
                    locale: ptBR,
                  })
                )}{" "}
                às{" "}
                {format(new Date(patient.lastConsult), "HH:mm", {
                  locale: ptBR,
                })}
              </>
            ) : (
              "Ainda não consultou"
            )}
          </TableCell>
          <TableCell align="right" className='flex gap-2'>
            <Confirmation
              text={`Deseja deletar o paciente ${patient.name} ${patient.lastName}?`}
              description="Essa ação não pode ser desfeita. Isso deleterá permanentemente esse paciente dos nossos servidores."
              fn={() => {
                toast.promise(handleDelete(patient.id), { loading: "Deletando..." });
              }}
            >
              <Button
                variant={"destructive"}
                className="bg-red-700 p-2 rounded-md hover:bg-red-900 transition-all duration-200 max-sm:p-1 disabled:cursor-not-allowed disabled:opacity-50"
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

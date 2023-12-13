"use client";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { PatientType, schedulePostSchema } from "@/validations/validations";
import { useState } from "react";
import { capitalize } from "@/utils/utils";
import axios, { AxiosError } from "axios";
import { useStore } from "@/store";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Confirmation from "../Confirmation";

export default function DashboardCadastro() {
  const [currentPage, setCurrentPage] = useState(1);
  const { patients, setPatients, pending, setPending } = useStore((state) => ({
    patients: state.patients,
    setPatients: state.setPatients,
    pending: state.pending,
    setPending: state.setPending,
  }));
  if (!patients) return <p>Loading...</p>;
  const itemsPerPage = 8;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const totalPages =
    patients.length > 0 ? Math.ceil(patients.length / itemsPerPage) : 1;

  const handleDelete = async (id: string) => {
    try {
      setPending(true);
      await axios.delete(`/api/patient/${id}`);

      setPatients(
        patients.filter((schedule: PatientType) => schedule.id !== id)
      );

      setPending(false);
    } catch (error) {
      setPending(false);
      throw error;
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>Seus pacientes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="hover:underline">Nome</button>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  <div className="grid gap-4">
                    <Button
                      onClick={() => {
                        setPatients(
                          [...patients].sort((a, b) => {
                            if (a.lastConsult && b.lastConsult) {
                              const dateA = new Date(a.lastConsult);
                              const dateB = new Date(b.lastConsult);
                              return dateA.getTime() - dateB.getTime();
                            } else return a.name.localeCompare(b.name);
                          })
                        );
                      }}
                    >
                      Padrão
                    </Button>
                    <Button
                      onClick={() => {
                        setPatients(
                          [...patients].sort((a, b) => {
                            return a.name.localeCompare(b.name);
                          })
                        );
                      }}
                    >
                      Nome Crescente
                    </Button>
                    <Button
                      onClick={() => {
                        setPatients(
                          [...patients].sort((a, b) => {
                            return b.name.localeCompare(a.name);
                          })
                        );
                      }}
                    >
                      Nome Decrescente
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Convênio</TableHead>
            <TableHead>Última Consulta</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.slice(startIndex, endIndex).map((patient, index) => (
            <TableRow key={patient.id}>
              <TableCell>
                {patient.name} {patient.lastName}
              </TableCell>
              <TableCell>{patient.cpf}</TableCell>
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
              <TableCell align="right">
                {pending ? (
                  <Button
                    variant={"destructive"}
                    className="bg-red-700 p-2 rounded-md hover:bg-red-900 transition-all duration-200 max-sm:p-1 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={true}
                  >
                    <Trash2 />
                  </Button>
                ) : (
                  <Confirmation
                    text={`Deseja deletar o paciente ${patient.name} ${patient.lastName}?`}
                    description="Essa ação não pode ser desfeita. Isso deleterá permanentemente esse
                    paciente dos nossos servidores."
                    children={
                      <Button
                        variant={"destructive"}
                        className="bg-red-700 p-2 rounded-md hover:bg-red-900 transition-all duration-200 max-sm:p-1 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={false}
                      >
                        <Trash2 />
                      </Button>
                    }
                    fn={() => {
                      toast.promise(handleDelete(patient.id), {
                        loading: "Deletando...",
                        success: () => {
                          return `Paciente deletado com sucesso!`;
                        },
                        error: (err) => {
                          if (err instanceof AxiosError)
                            return `${err.response?.data.message}`;
                          else return `Ocorreu um erro inesperado`;
                        },
                      });
                    }}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex gap-2 px-8">
        <Button
          onClick={() => {
            setCurrentPage(currentPage - 1);
          }}
          variant={"harderOutline"}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Anterior
        </Button>
        <span className="ml-4 mr-4 py-2">
          {currentPage}/{totalPages}
        </span>
        <Button
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
          variant={"harderOutline"}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}

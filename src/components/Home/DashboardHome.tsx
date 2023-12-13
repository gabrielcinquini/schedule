"use client";

import { Trash2, CheckSquare, XSquare } from "lucide-react";
import { ScheduleType, UseMeType } from "@/validations/validations";
import { useState } from "react";
import { capitalize } from "@/utils/utils";
import axios, { Axios, AxiosError } from "axios";
import { useStore } from "@/store";
import { toast } from "sonner";
import { format } from "date-fns";

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
import { ptBR } from "date-fns/locale";
import Confirmation from "../Confirmation";

export default function DashboardHome({ user }: { user: UseMeType }) {
  const { schedules, setSchedules, pending, setPending } = useStore(
    (state) => ({
      schedules: state.schedules,
      setSchedules: state.setSchedules,
      pending: state.pending,
      setPending: state.setPending,
    })
  );
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const totalPages =
    schedules.length > 0 ? Math.ceil(schedules.length / itemsPerPage) : 1;

  const handleDelete = async (id: string) => {
    try {
      setPending(true);
      await axios.delete(`/api/schedules/${id}`);

      setSchedules(schedules.filter((schedule) => schedule.id !== id));
      setPending(false);
    } catch (error) {
      setPending(false);
      throw error;
    }
  };

  const handleComplete = async (schedule: ScheduleType) => {
    try {
      setPending(true);
      await axios.post("/api/services", {
        name: schedule.name,
        lastName: schedule.lastName,
        date: schedule.date,
        value: schedule.value,
        isComplete: true,
        patientId: schedule.patientId,
        userId: user.id,
      });
      await handleDelete(schedule.id);
      setPending(false);
    } catch (error) {
      setPending(false);
      throw error;
    }
  };

  const handleNotComplete = async (schedule: ScheduleType) => {
    try {
      setPending(true);
      await axios.post("/api/services", {
        name: schedule.name,
        lastName: schedule.lastName,
        date: schedule.date,
        value: schedule.value,
        isComplete: false,
        patientId: schedule.patientId,
        userId: user.id,
      });
      await handleDelete(schedule.id);
      setPending(false);
    } catch (error) {
      setPending(false);
      console.error(error);
      throw error;
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>Sua agenda.</TableCaption>
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
                        setSchedules(
                          [...schedules].sort((a, b) => {
                            const dateA = new Date(a.date);
                            const dateB = new Date(b.date);
                            return dateA.getTime() - dateB.getTime();
                          })
                        );
                      }}
                    >
                      Padrão
                    </Button>
                    <Button
                      onClick={() => {
                        setSchedules(
                          [...schedules].sort((a, b) => {
                            return a.name.localeCompare(b.name);
                          })
                        );
                      }}
                    >
                      Nome Crescente
                    </Button>
                    <Button
                      onClick={() => {
                        setSchedules(
                          [...schedules].sort((a, b) => {
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
            <TableHead>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="hover:underline">Data</button>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  <div className="grid gap-4">
                    <Button
                      onClick={() => {
                        setSchedules(
                          [...schedules].sort((a, b) => {
                            const dateA = new Date(a.date);
                            const dateB = new Date(b.date);
                            return dateA.getTime() - dateB.getTime();
                          })
                        );
                      }}
                    >
                      Data Crescente
                    </Button>
                    <Button
                      onClick={() => {
                        setSchedules(
                          [...schedules].sort((a, b) => {
                            const dateA = new Date(a.date);
                            const dateB = new Date(b.date);
                            return dateB.getTime() - dateA.getTime();
                          })
                        );
                      }}
                    >
                      Data Decrescente
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="hover:underline">Valor</button>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  <div className="grid gap-4">
                    <Button
                      onClick={() => {
                        setSchedules(
                          [...schedules].sort((a, b) => {
                            return b.value - a.value;
                          })
                        );
                      }}
                    >
                      Valor Crescente
                    </Button>
                    <Button
                      onClick={() => {
                        setSchedules(
                          [...schedules].sort((a, b) => {
                            return a.value - b.value;
                          })
                        );
                      }}
                    >
                      Valor Decrescente
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules.slice(startIndex, endIndex).map((schedule, index) => (
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
                {pending ? (
                  <div className="flex">
                    <Button
                      className="bg-green-600 p-2 rounded-md mr-2 hover:bg-green-800 transition-all duration-200 max-sm:p-1 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={true}
                    >
                      <CheckSquare />
                    </Button>
                    <Button
                      className="bg-orange-400 p-2 rounded-md mr-2 hover:bg-orange-500 transition-all duration-200 max-sm:p-1 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={true}
                    >
                      <XSquare />
                    </Button>
                    <Button
                      variant={"destructive"}
                      className="bg-red-700 p-2 rounded-md hover:bg-red-900 transition-all duration-200 max-sm:p-1 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={true}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ) : (
                  <div className="flex">
                    <Confirmation
                      text={`A consulta com ${schedule.name} ${
                        schedule.lastName
                      } marcada para às ${format(
                        new Date(schedule.date),
                        "HH:mm",
                        { locale: ptBR }
                      )} do dia ${format(new Date(schedule.date), "dd/MM/yy")} -
                       ${capitalize(
                         format(new Date(schedule.date), "EE", { locale: ptBR })
                       )} foi realizada?`}
                      description={`Essa consulta será movida para o seu TOTAL como: 'Consulta Realizada'`}
                      fn={() => {
                        toast.promise(handleComplete(schedule), {
                          loading: "Movendo para as consultas realizadas...",
                          success: () => {
                            return `Movido para as consultas realizadas com sucesso!`;
                          },
                          error: (err) => {
                            if (err instanceof AxiosError)
                              return `${err.response?.data.message}`;
                            else return `Ocorreu um erro inesperado`;
                          },
                        });
                      }}
                    >
                      <Button className="bg-green-600 p-2 rounded-md mr-2 hover:bg-green-800 transition-all duration-200 max-sm:p-1">
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
                      )} do dia ${format(new Date(schedule.date), "dd/MM/yy")} -
                       ${capitalize(
                         format(new Date(schedule.date), "EE", { locale: ptBR })
                       )} foi desmarcada?`}
                      description={`Essa consulta será movida para o seu TOTAL como: 'Consulta Desmarcada'`}
                      fn={() => {
                        toast.promise(handleNotComplete(schedule), {
                          loading:
                            "Movendo para as consultas não realizadas...",
                          success: () => {
                            return `Movido com sucesso!`;
                          },
                          error: (err) => {
                            if (err instanceof AxiosError)
                              return `${err.response?.data.message}`;
                            else return `Ocorreu um erro inesperado`;
                          },
                        });
                      }}
                    >
                      <Button className="bg-orange-400 p-2 rounded-md mr-2 hover:bg-orange-500 transition-all duration-200 max-sm:p-1">
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
                      )} do dia ${format(new Date(schedule.date), "dd/MM/yy")} -
                       ${capitalize(
                         format(new Date(schedule.date), "EE", { locale: ptBR })
                       )}?`}
                      description={`Essa ação não pode ser desfeita. Isso deleterá permanentemente esse
                      agendamento dos nossos servidores.`}
                      fn={() => {
                        toast.promise(handleDelete(schedule.id), {
                          loading: "Deletando...",
                          success: () => {
                            return `Deletado com sucesso!`;
                          },
                          error: (err) => {
                            if (err instanceof AxiosError)
                              return `${err.response?.data.message}`;
                            else return `Ocorreu um erro inesperado`;
                          },
                        });
                      }}
                    >
                      <Button
                        className="bg-red-700 p-2 rounded-md hover:bg-red-900 transition-all duration-200 max-sm:p-1"
                      >
                        <Trash2 />
                      </Button>
                    </Confirmation>
                  </div>
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

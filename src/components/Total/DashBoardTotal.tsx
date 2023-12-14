import { useServices } from "@/hooks/useServices";
import { UseMeType } from "@/validations/validations";
import { capitalize } from "@/utils/utils";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
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
import { Input } from "../ui/input";

export default function DashBoardTotal({ user }: { user: UseMeType }) {
  const { services } = useServices({ user });
  const [filter, setFilter] = useState("");
  const { setServices, pending, setPending } = useStore((state) => ({
    services: state.services,
    setServices: state.setServices,
    pending: state.pending,
    setPending: state.setPending,
  }));
  const [currentPage, setCurrentPage] = useState(1);
  if (!services) return <p>Loading...</p>;

  const itemsPerPage = 8;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredSchedules = services.filter((service) => {
    const fullName = `${service.name} ${service.lastName}`.toLowerCase();
    const value = new Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "BRL",
    }).format(service.value);
    const formattedDate = format(new Date(service.date), "dd/MM/yy").toLowerCase();
    const formattedDay = capitalize(format(new Date(service.date), "EEEE", { locale: ptBR })).toLowerCase();
    return (
      fullName.includes(filter.toLowerCase()) ||
      value.toString().includes(filter) ||
      formattedDate.includes(filter.toLocaleLowerCase()) ||
      formattedDay.includes(filter.toLocaleLowerCase())
    );
  });

  const totalPages =
    filteredSchedules.length > 0
      ? Math.ceil(filteredSchedules.length / itemsPerPage)
      : 1;

  const handleDelete = async (id: string) => {
    try {
      setPending(true);
      await axios.delete(`/api/services/${id}`);

      setServices(services.filter((service) => service.id !== id));
      setPending(false);
    } catch (error) {
      setPending(false);
      throw error;
    }
  };

  return (
    <div>
      <Input
        type="text"
        placeholder="Filtrar por nome/valor/data/dia"
        value={filter}
        onChange={(e) => {
          setCurrentPage(1);
          setFilter(e.target.value);
        }}
        className="mt-2 w-1/2 max-sm:w-full"
      />
      <Table>
        <TableCaption>Sua lista de serviços.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="hover:underline">Nome</button>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  <div className="grid gap-4">
                    <Button
                      onClick={() => {
                        setServices(
                          [...services].sort((a, b) => {
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
                        setServices(
                          [...services].sort((a, b) => {
                            return a.name.localeCompare(b.name);
                          })
                        );
                      }}
                    >
                      Nome Crescente
                    </Button>
                    <Button
                      onClick={() => {
                        setServices(
                          [...services].sort((a, b) => {
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
                        setServices(
                          [...services].sort((a, b) => {
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
                        setServices(
                          [...services].sort((a, b) => {
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
                        setServices(
                          [...services].sort((a, b) => {
                            return b.value - a.value;
                          })
                        );
                      }}
                    >
                      Valor Crescente
                    </Button>
                    <Button
                      onClick={() => {
                        setServices(
                          [...services].sort((a, b) => {
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
          {filteredSchedules.slice(startIndex, endIndex).map((service, index) => (
            <TableRow
              key={service.id}
              className={
                service.isComplete ? "bg-green-700/20" : "bg-orange-400/20"
              }
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
                      toast.promise(handleDelete(service.id), {
                        error: "Erro ao deletar",
                        success: () => {
                          return `Deletado com sucesso!`;
                        },
                        loading: "Deletando...",
                      });
                    }}
                  >
                    <Button
                      variant={"destructive"}
                      className="bg-red-700 p-2 rounded-md hover:bg-red-900 transition-all duration-200 max-sm:p-1"
                      disabled={false}
                    >
                      <Trash2 />
                    </Button>
                  </Confirmation>
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

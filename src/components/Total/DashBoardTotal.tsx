import { useServices } from "@/hooks/useServices";
import { UseMeType } from "@/validations/validations";
import { getDate } from "@/utils/utils";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
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
import { Button } from "../ui/button";

export default function DashBoardTotal({ user }: { user: UseMeType }) {
  const { services } = useServices({ user });
  const { setServices, pending, setPending } = useStore((state) => ({
    setServices: state.setServices,
    pending: state.pending,
    setPending: state.setPending,
  }));
  const [currentPage, setCurrentPage] = useState(1);
  if (!services) return <p>Loading...</p>;

  const itemsPerPage = 8;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const totalPages =
    services.length > 0 ? Math.ceil(services.length / itemsPerPage) : 1;

  const handleDelete = async (id: string) => {
    try {
      setPending(true);
      await axios.delete(`/api/services/${id}`);

      setServices(services.filter((service) => service.id !== id));
      setPending(false);
    } catch (error) {
      setPending(false);
      if (error instanceof AxiosError && error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Ocorreu um erro ao deletar");
      }
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>Sua lista de serviços.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nome</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.slice(startIndex, endIndex).map((service, index) => (
            <TableRow
              key={service.id}
              className={
                service.isComplete ? "bg-green-700/20" : "bg-orange-400/20"
              }
            >
              <TableCell>
                {service.name} {service.lastName}
              </TableCell>
              <TableCell>{getDate(service.date).data}</TableCell>
              <TableCell>{getDate(service.date).horario}</TableCell>
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
                  <Button
                    variant={"destructive"}
                    className="bg-red-700 p-2 rounded-md hover:bg-red-900 transition-all duration-200 max-sm:p-1"
                    onClick={() => {
                      toast.promise(handleDelete(service.id), {
                        error: "Erro ao deletar",
                        success: () => {
                          return `Deletado com sucesso!`;
                        },
                        loading: "Deletando...",
                      });
                    }}
                  >
                    <Trash2 />
                  </Button>
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

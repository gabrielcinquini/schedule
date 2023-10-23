import { useServices } from "@/hooks/useServices";
import { ServiceSchemaType, UseMeType } from "@/validations/validations";
import { getDate } from "@/utils/utils";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useStore } from "@/store";

export default function DashBoardTotal({ user }: { user: UseMeType }) {
  const { services } = useServices({ user });
  const { setServices } = useStore((state) => ({
    setServices: state.setServices,
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
      await axios.delete(
        `${process.env.NEXT_PUBLIC_APIURL}/api/services/${id}`
      );

      setServices(services.filter((service) => service.id !== id));
      toast.success("Removido com sucesso!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error("Ocorreu um erro ao deletar o paciente", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  return (
    <div>
      <table className="w-full border-separate border-spacing-y-2 p-8 max-sm:py-2 max-sm:px-0">
        <thead className="text-left">
          <tr className="text-white">
            <th className="px-2">Nome</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Valor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {services.slice(startIndex, endIndex).map((service, index) => (
            <tr
              key={service.id}
              className={service.isComplete ? "bg-green-700" : "bg-orange-400"}
            >
              <td className="px-2">
                {service.name} {service.lastName}
              </td>
              <td>{getDate(service.date).data}</td>
              <td>{getDate(service.date).horario}</td>
              <td>
                {service.value === 0
                  ? "Isento"
                  : new Intl.NumberFormat("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    }).format(service.value)}
              </td>
              <td align="right">
                <button
                  className="bg-red-700 p-2 rounded-md hover:bg-red-900 transition-all duration-200"
                  onClick={() => {
                    handleDelete(service.id);
                  }}
                >
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2 px-8">
        <button
          onClick={() => {
            setCurrentPage(currentPage - 1);
          }}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1 ? "opacity-50 pointer-events-none" : ""
          } bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
        >
          Anterior
        </button>
        <span className="ml-4 mr-4 py-2">
          {currentPage}/{totalPages}
        </span>
        <button
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
          } bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

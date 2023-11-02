"use client";

import { Trash2, CheckSquare, XSquare } from "lucide-react";
import { ScheduleType, UseMeType } from "@/validations/validations";
import { useState } from "react";
import { getDate } from "@/utils/utils";
import axios from "axios";
import { useStore } from "@/store";
import { toast } from "sonner";

export default function DashboardHome({ user }: { user: UseMeType }) {
  const { schedules, setSchedules, pending, setPending } = useStore((state) => ({
    schedules: state.schedules,
    setSchedules: state.setSchedules,
    pending: state.pending,
    setPending: state.setPending,
  }));
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
      console.error("Error deleting item:", error);
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
      console.error("Error on complete:", error);
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
      console.error("Error on complete:", error);
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
          {schedules.slice(startIndex, endIndex).map((schedule, index) => (
            <tr
              key={schedule.id}
              className={index % 2 === 0 ? "bg-green-700" : "bg-blue-700"}
            >
              <td className="px-2">
                {schedule.name} {schedule.lastName}
              </td>
              <td>{getDate(schedule.date).data}</td>
              <td>{getDate(schedule.date).horario}</td>
              <td>
                {schedule.value === 0
                  ? "Isento"
                  : new Intl.NumberFormat("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    }).format(schedule.value)}
              </td>
              <td align="right">
                {pending ? (
                  <>
                    <button
                      className="bg-green-600 p-2 rounded-md mr-2 hover:bg-green-800 transition-all duration-200 max-sm:p-1 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={true}
                    >
                      <CheckSquare />
                    </button>
                    <button
                      className="bg-orange-400 p-2 rounded-md mr-2 hover:bg-orange-500 transition-all duration-200 max-sm:p-1 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={true}
                    >
                      <XSquare />
                    </button>
                    <button
                      className="bg-red-700 p-2 rounded-md hover:bg-red-900 transition-all duration-200 max-sm:p-1 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={true}
                    >
                      <Trash2 />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-green-600 p-2 rounded-md mr-2 hover:bg-green-800 transition-all duration-200 max-sm:p-1"
                      onClick={() => {
                        toast.promise(handleComplete(schedule), {
                          error: "Erro ao mover",
                          success: () => {
                            return `Movido com sucesso!`;
                          },
                          loading: "Movendo para as consultas realizadas...",
                        });
                      }}
                    >
                      <CheckSquare />
                    </button>
                    <button
                      className="bg-orange-400 p-2 rounded-md mr-2 hover:bg-orange-500 transition-all duration-200 max-sm:p-1"
                      onClick={() => {
                        toast.promise(handleNotComplete(schedule), {
                          error: "Erro ao mover",
                          success: () => {
                            return `Movido com sucesso!`;
                          },
                          loading: "Movendo para as consultas não realizadas...",
                        });
                      }}
                    >
                      <XSquare />
                    </button>
                    <button
                      className="bg-red-700 p-2 rounded-md hover:bg-red-900 transition-all duration-200 max-sm:p-1"
                      onClick={() => {
                        toast.promise(handleDelete(schedule.id), {
                          error: "Erro ao deletar",
                          success: () => {
                            return `Deletado com sucesso!`;
                          },
                          loading: "Deletando...",
                        });
                      }}
                    >
                      <Trash2 />
                    </button>
                  </>
                )}
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

"use client";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { PatientType } from "@/validations/validations";
import { useState } from "react";
import { getDate } from "@/utils/utils";
import axios, { AxiosError } from "axios";
import { useStore } from "@/store";

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
      if (error instanceof AxiosError && error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Ocorreu um erro ao deletar o paciente");
      }
    }
  };

  return (
    <div>
      <table className="w-full border-separate border-spacing-y-2 p-8 max-sm:py-2 max-sm:px-0">
        <thead className="text-left">
          <tr className="text-white">
            <th className="px-2">Nome</th>
            <th>CPF</th>
            <th>Convênio</th>
            <th>Última confirmação de consulta</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {patients.slice(startIndex, endIndex).map((patient, index) => (
            <tr
              key={patient.id}
              className={index % 2 === 0 ? "bg-green-700" : "bg-blue-700"}
            >
              <td className="px-2">
                {patient.name} {patient.lastName}
              </td>
              <td>{patient.cpf}</td>
              <td>{patient.convenio}</td>
              <td>
                {patient.lastConsult
                  ? getDate(patient.lastConsult).data
                  : "Ainda não consultou"}
              </td>
              <td align="right">
                {pending ? (
                  <button
                    className="bg-red-800 p-2 rounded-md max-sm:p-1 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={true}
                  >
                    <Trash2 />
                  </button>
                ) : (
                  <button
                    className="bg-red-800 p-2 rounded-md hover:bg-red-900 transition-all duration-200 max-sm:p-1"
                    onClick={() => {
                      toast.promise(handleDelete(patient.id), {
                        error: "Erro ao deletar o paciente",
                        success: () => {
                          return `Paciente deletado com sucesso!`;
                        },
                        loading: "Deletando...",
                      });
                    }}
                  >
                    <Trash2 />
                  </button>
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

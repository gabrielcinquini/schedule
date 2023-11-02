"use client";

import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../ErrorMessage";
import { useSchedules } from "@/hooks/useSchedules";
import {
  RegisterScheduleFormType,
  registerToScheduleFormSchema,
  UseMeType,
} from "@/validations/validations";
import { formatValue } from "@/utils/utils";
import Header from "../Header";
import { usePatients } from "@/hooks/usePatients";
import { useStore } from "@/store";

export default function HeaderHome({ user }: { user: UseMeType }) {
  const { schedules } = useSchedules({ user: user });
  const { patients } = usePatients({ user: user });
  const { setSchedules, pending, setPending } = useStore((state) => ({
    setSchedules: state.setSchedules,
    pending: state.pending,
    setPending: state.setPending,
  }));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    ...rest
  } = useForm<RegisterScheduleFormType>({
    mode: "onChange",
    defaultValues: {
      userId: user?.id,
      value: "R$ 0,00",
    },
    resolver: zodResolver(registerToScheduleFormSchema),
  });
  if (!schedules || !patients) return <p>Loading...</p>;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientConvenio, setSelectedPatientConvenio] = useState("");

  useEffect(() => {
    if (patients.length > 0) {
      setSelectedPatientConvenio(patients[0].convenio);
    }
  }, [patients]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e: any) => {
    const selectedPatient = patients.find((p) => p.id === e.target.value);
    if (selectedPatient) {
      setSelectedPatientConvenio(selectedPatient.convenio);
    }
  };

  const handleRegisterSchedule = async (data: RegisterScheduleFormType) => {
    try {
      setPending(true);
      const selectedPatient = patients.find((p) => p.id === data.patientId);
      const date = new Date(`${data.date} ${data.time}:00`);
      if (!selectedPatient) throw new Error();

      if (selectedPatient.convenio === "Isento") {
        data.value = "0";
      }

      const transformedValue = data.value
        .replace(/\s/g, "")
        .replace("R$", "")
        .replace(",", ".");

      const response = await axios.post("/api/schedules", {
        name: selectedPatient.name,
        lastName: selectedPatient.lastName,
        date: date,
        value: transformedValue,
        userId: data.userId,
        patientId: data.patientId,
      });
      if (response.status === 200) {
        toast.success("Paciente agendado com sucesso!");
        const newSchedule = response.data;
        schedules.push(newSchedule);

        setSchedules(
          schedules.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA.getTime() - dateB.getTime();
          })
        );
        closeModal();
        setPending(false);
      }
    } catch (error) {
      setPending(false);
      //@ts-expect-error
      if (error instanceof AxiosError && error.response.status === 500) {
        toast.error("Não foi possível conectar ao banco de dados");
      }
      //@ts-expect-error
      else if (error instanceof AxiosError && error.response.status === 400) {
        toast.error("Já possui um paciente cadastrado nesse horário");
      }
      //@ts-expect-error
      else if (error instanceof AxiosError && error.response.status === 404) {
        toast.error("Não foi possível agendar o paciente");
      }
    }
  };

  return (
    <>
      <Header
        user={user}
        openModal={openModal}
        title="Agendar paciente"
        currentPage="home"
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Register Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: window.innerWidth < 828 ? "70%" : "40%",
            height: "75%",
            margin: "auto",
          },
        }}
      >
        <button
          className="absolute right-10 px-2 text-white bg-slate-700 rounded-lg"
          onClick={closeModal}
        >
          X
        </button>
        <div className="text-slate-800">
          <div className="p-16 max-sm:p-1">
            <h1 className="text-gray-800 bolder text-4xl mb-12 max-sm:text-xl">
              Agendar paciente
            </h1>
            {patients.length > 0 ? (
              <form
                className="flex flex-col gap-4 max-sm:gap-2 max-sm:text-sm"
                onSubmit={handleSubmit(handleRegisterSchedule)}
              >
                <select
                  className="bg-slate-200 rounded-md p-4 appearance-none max-sm:p-3"
                  {...register("patientId", {
                    value: patients[0].id,
                    onChange: handleChange,
                  })}
                >
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} {patient.lastName}
                    </option>
                  ))}
                </select>
                <input
                  autoComplete="off"
                  type="date"
                  className="bg-slate-200 rounded-md p-4 appearance-none max-sm:p-3"
                  placeholder="Data"
                  {...register("date")}
                />
                {errors.date && <ErrorMessage message={errors.date.message} />}
                <input
                  autoComplete="off"
                  type="time"
                  className="bg-slate-200 rounded-md p-4 appearance-none max-sm:p-3"
                  placeholder="Hora"
                  {...register("time")}
                />
                {errors.time && <ErrorMessage message={errors.time.message} />}
                {selectedPatientConvenio !== "Isento" && (
                  <input
                    autoComplete="off"
                    type="text"
                    className="bg-slate-200 rounded-md p-4 appearance-none max-sm:p-3"
                    placeholder="Valor"
                    {...register("value", {
                      onChange: formatValue,
                    })}
                  />
                )}
                {pending ? (
                  <input
                    type="submit"
                    className="text-white bg-green-400 py-6 rounded-md hover:cursor-pointer text-lg max-sm:p-5 max-sm:text-base disabled:cursor-not-allowed disabled:opacity-50"
                    value="Enviando..."
                    disabled={true}
                  />
                ) : (
                  <input
                    type="submit"
                    className="text-white bg-green-400 py-6 rounded-md hover:cursor-pointer text-lg max-sm:p-5 max-sm:text-base"
                  />
                )}
              </form>
            ) : (
              <p className="text-center text-2xl text-red-800 font-bold max-sm:text-xl">
                Nenhum paciente cadastrado!
              </p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

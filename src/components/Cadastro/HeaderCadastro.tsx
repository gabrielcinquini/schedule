"use client";

import React, { useState } from "react";
import Modal from "react-modal";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../ErrorMessage";
import {
  RegisterPatientFormType,
  registerPatientFormSchema,
  UseMeType,
  PatientType,
} from "@/validations/validations";
import { formatCPF, formatName } from "@/utils/utils";
import Header from "../Header";
import { usePatients } from "@/hooks/usePatients";

export default function HeaderCadastro({ user }: { user: UseMeType }) {
  const { patients, setPatients } = usePatients({ user });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPatientFormType>({
    mode: "onChange",
    defaultValues: {
      userId: user.id,
    },
    resolver: zodResolver(registerPatientFormSchema),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (!patients) return <p>Loading...</p>;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleRegisterPatient = async (data: RegisterPatientFormType) => {
    try {
      const newPatient = await axios.post("/api/patient", {
        name: data.name,
        lastName: data.lastName,
        cpf: data.cpf,
        convenio: data.convenio,
        userId: data.userId,
      });
      toast.success("Paciente cadastrado com sucesso!");
      setPatients(
        [...patients, newPatient.data].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );
      closeModal();
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Ocorreu um erro ao cadastrar o paciente");
      }
    }
  };

  return (
    <>
      <Header
        user={user}
        openModal={openModal}
        title="Cadastrar Paciente"
        currentPage="cadastro"
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
            width: window.innerWidth < 828 ? "80%" : "40%",
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
            <h1 className="text-gray-800 bolder text-4xl mb-12 max-sm:text-2xl">
              Cadastrar paciente
            </h1>
            <form
              className="flex flex-col gap-4 max-sm:gap-2 max-sm:text-sm"
              onSubmit={handleSubmit(handleRegisterPatient)}
            >
              <input
                autoComplete="off"
                type="text"
                className="bg-slate-200 rounded-md p-4 appearance-none max-sm:p-3"
                placeholder="Nome"
                {...register("name", {
                  onChange: formatName,
                })}
              />
              {errors.name && <ErrorMessage message={errors.name.message} />}
              <input
                autoComplete="off"
                type="text"
                className="bg-slate-200 rounded-md p-4 appearance-none max-sm:p-3"
                placeholder="Sobrenome"
                {...register("lastName", {
                  onChange: formatName,
                })}
              />
              {errors.lastName && (
                <ErrorMessage message={errors.lastName.message} />
              )}
              <input
                autoComplete="off"
                type="text"
                className="bg-slate-200 rounded-md p-4 appearance-none max-sm:p-3"
                placeholder="CPF"
                {...register("cpf", {
                  onChange: formatCPF,
                })}
              />
              {errors.cpf && <ErrorMessage message={errors.cpf.message} />}
              <select
                className="p-4 border-none max-sm:p-3"
                {...register("convenio")}
              >
                <option value="Sessão">Sessão</option>
                <option value="Convênio">Convênio</option>
                <option value="Isento">Isento</option>
              </select>
              {errors.convenio && (
                <ErrorMessage message={errors.convenio.message} />
              )}
              <input
                type="submit"
                className="text-white bg-green-400 p-6 rounded-md hover:cursor-pointer text-lg max-sm:p-5 max-sm:text-base"
              />
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}

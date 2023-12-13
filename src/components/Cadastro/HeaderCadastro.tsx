"use client";

import React, { useState } from "react";
import Modal from "react-modal";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterPatientFormType,
  registerPatientFormSchema,
  UseMeType,
} from "@/validations/validations";
import { formatCPF, formatName } from "@/utils/utils";
import Header from "../Header";
import { usePatients } from "@/hooks/usePatients";
import { useStore } from "@/store";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Loader from "../Loader";

export default function HeaderCadastro({ user }: { user: UseMeType }) {
  const { patients, setPatients } = usePatients({ user });

  const form = useForm<RegisterPatientFormType>({
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
      if (error instanceof AxiosError && error.response?.status === 404)
        toast.error(error.response.data.message);
      else toast.error("Ocorreu um erro ao cadastrar o paciente");
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
            background: "hsl(var(--background))",
            border: "none",
          },
        }}
      >
        <Button
          variant={"ghost"}
          className="absolute right-10"
          onClick={closeModal}
        >
          X
        </Button>
        <div>
          <div className="p-16 max-sm:p-1">
            <h1 className="bolder text-4xl mb-12 max-sm:text-2xl">
              Cadastrar paciente
            </h1>

            <Form {...form}>
              <form
                className="flex flex-col gap-4 max-sm:gap-2 max-sm:text-sm"
                onSubmit={form.handleSubmit(handleRegisterPatient)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          type="text"
                          className="p-7 max-sm:p-3"
                          placeholder="Nome"
                          {...field}
                          onChange={(event) => {
                            formatName(event);
                            field.onChange(event);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          type="text"
                          className="p-7 appearance-none max-sm:p-3"
                          placeholder="Sobrenome"
                          {...field}
                          onChange={(event) => {
                            formatName(event);
                            field.onChange(event);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          type="text"
                          className="p-7 appearance-none max-sm:p-3"
                          placeholder="CPF"
                          {...field}
                          onChange={(event) => {
                            formatCPF(event);
                            field.onChange(event);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="convenio"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="p-7">
                            <SelectValue placeholder="Selecione o convênio" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="Sessão">Sessão</SelectItem>
                              <SelectItem value="Convênio">Convênio</SelectItem>
                              <SelectItem value="Isento">Isento</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="text-lg p-9"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && <Loader />}
                  Enviar
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
}

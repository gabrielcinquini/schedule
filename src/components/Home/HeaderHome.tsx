"use client";

import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "../ui/input";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ptBR } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

export default function HeaderHome({ user }: { user: UseMeType }) {
  const { schedules } = useSchedules({ user: user });
  const { patients } = usePatients({ user: user });
  const { setSchedules } = useStore((state) => ({
    setSchedules: state.setSchedules,
  }));

  const form = useForm<RegisterScheduleFormType>({
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

  const handleChange = (patientId: any) => {
    const selectedPatient = patients.find((p) => p.id === patientId);
    if (selectedPatient) {
      setSelectedPatientConvenio(selectedPatient.convenio);
    }
  };

  const handleRegisterSchedule = async (data: RegisterScheduleFormType) => {
    try {
      const selectedPatient = patients.find((p) => p.id === data.patientId);
      if (!selectedPatient) throw new Error();

      let date = new Date(data.date);
      let hora = data.time;
      let [novaHora, novosMinutos] = hora.split(":");
      date.setHours(parseInt(novaHora, 10));
      date.setMinutes(parseInt(novosMinutos, 10));

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

      toast.success("Paciente agendado com sucesso!");
      const newSchedule = response.data.schedule;
      schedules.push(newSchedule);

      setSchedules(
        schedules.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        })
      );
      closeModal();
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
      else toast.error("Ocorreu um erro inesperado");
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
            <h1 className="bolder text-4xl mb-12 max-sm:text-xl">
              Agendar paciente
            </h1>
            {patients.length > 0 ? (
              <Form {...form}>
                <form
                  className="flex flex-col gap-4 max-sm:gap-2 max-sm:text-sm"
                  onSubmit={form.handleSubmit(handleRegisterSchedule)}
                >
                  <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={(e) => {
                              field.onChange(e), handleChange(e);
                            }}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="p-7">
                              <SelectValue placeholder="Selecione o paciente" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {patients.map((patient) => (
                                  <SelectItem
                                    key={patient.id}
                                    value={patient.id}
                                  >
                                    {patient.name} {patient.lastName}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "p-7 w-full text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(Number(field.value), "PPP", {
                                    locale: ptBR,
                                  })
                                ) : (
                                  <span>Selecione a data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onDayClick={field.onChange}
                              disabled={(date) =>
                                date < new Date("1900-01-01") ||
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              locale={ptBR}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            type="time"
                            className="p-7 appearance-none"
                            placeholder="Hora"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          {selectedPatientConvenio !== "Isento" && (
                            <Input
                              autoComplete="off"
                              type="text"
                              className="p-7 appearance-none"
                              placeholder="Valor"
                              {...field}
                              onChange={(event) => {
                                formatValue(event);
                                field.onChange(event);
                              }}
                            />
                          )}
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

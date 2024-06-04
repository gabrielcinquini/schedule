import React, { useEffect, useState } from 'react'

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
import Loader from "../../../../../components/Loader";
import { useForm } from 'react-hook-form';
import { RegisterScheduleFormType, registerToScheduleFormSchema } from '@/validations/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePatients } from '@/hooks/Patients/usePatients';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import ptBR from 'date-fns/locale/pt-BR';
import { Input } from '@/components/ui/input';
import { formatValue } from '@/utils/utils';
import { cn } from '@/lib';
import { useCreateSchedule } from '@/hooks/Schedule/createSchedule';
import { Skeleton } from '@/components/ui/skeleton';

export function CreateScheduleForm() {
  const [selectedPatientConvenio, setSelectedPatientConvenio] = useState("");
  const { data: patients, isLoading } = usePatients()
  const { mutateAsync: onCreateSchedule } = useCreateSchedule()

  useEffect(() => {
    if (patients && patients.length > 0) {
      setSelectedPatientConvenio(patients[0].convenio);
    }
  }, [patients]);

  const form = useForm<RegisterScheduleFormType>({
    mode: "onChange",
    defaultValues: {
      value: "R$ 0,00",
    },
    resolver: zodResolver(registerToScheduleFormSchema),
  });

  const handleRegisterSchedule = async (data: RegisterScheduleFormType) => {
    const selectedPatient = patients?.find((p) => p.id === data.patientId);
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

    await onCreateSchedule({
      name: selectedPatient.name,
      lastName: selectedPatient.lastName,
      date: date,
      value: Number(transformedValue),
      patientId: data.patientId,
    })
  };

  const handleChange = (patientId: any) => {
    const selectedPatient = patients?.find((p) => p.id === patientId);
    if (selectedPatient) {
      setSelectedPatientConvenio(selectedPatient.convenio);
    }
  };

  if(isLoading) return (
    <div className='flex flex-col gap-4'>
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-full h-16" />
    </div>
  )

  return (
    <>
      {!!patients?.length ? (
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
                      <SelectTrigger className="px-2 py-5">
                        <SelectValue placeholder="Selecione o paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {patients?.map((patient) => (
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
                            "px-2 py-5 w-full text-left font-normal",
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
                      className="px-2 py-5 appearance-none"
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
                        className="px-2 py-5 appearance-none"
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
    </>
  )
}

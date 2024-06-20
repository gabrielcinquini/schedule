import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { CalendarIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import Loader from '@/components/Loader'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { usePatients } from '@/hooks/Patients/usePatients'
import { useCreateSchedule } from '@/hooks/Schedule/createSchedule'
import { cn } from '@/lib'
import { formatValue } from '@/utils/utils'
import {
  RegisterScheduleFormType,
  registerToScheduleFormSchema,
} from '@/validations/validations'

export function CreateScheduleForm() {
  const [selectedPatientConvenio, setSelectedPatientConvenio] = useState('')
  const { data, isLoading } = usePatients()
  const { mutateAsync: onCreateSchedule } = useCreateSchedule()

  useEffect(() => {
    if (data && data.patients.length > 0) {
      setSelectedPatientConvenio(data.patients[0].convenio)
    }
  }, [data])

  const form = useForm<RegisterScheduleFormType>({
    mode: 'onChange',
    defaultValues: {
      value: 'R$ 0,00',
    },
    resolver: zodResolver(registerToScheduleFormSchema),
  })

  const handleRegisterSchedule = form.handleSubmit(async (formValues) => {
    const selectedPatient = data?.patients.find(
      (p) => p.id === formValues.patientId,
    )
    if (!selectedPatient) throw new Error()

    const date = new Date(formValues.date)
    const hora = formValues.time
    const [novaHora, novosMinutos] = hora.split(':')
    date.setHours(parseInt(novaHora, 10))
    date.setMinutes(parseInt(novosMinutos, 10))

    if (selectedPatient.convenio === 'Isento') {
      formValues.value = '0'
    }

    const transformedValue = formValues.value
      .replace(/\s/g, '')
      .replace('R$', '')
      .replace(',', '.')

    await onCreateSchedule({
      name: selectedPatient.name,
      lastName: selectedPatient.lastName,
      date,
      value: Number(transformedValue),
      patientId: formValues.patientId,
    }).catch((e) => e)
  })

  const handleChange = (patientId: string) => {
    const selectedPatient = data?.patients?.find((p) => p.id === patientId)
    if (selectedPatient) {
      setSelectedPatientConvenio(selectedPatient.convenio)
    }
  }

  if (isLoading)
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )

  return (
    <>
      {data?.patients.length ? (
        <Form {...form}>
          <form
            className="flex flex-col gap-4 max-sm:gap-2 max-sm:text-sm"
            onSubmit={handleRegisterSchedule}
          >
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e)
                        handleChange(e)
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="px-2 py-5">
                        <SelectValue placeholder="Selecione o paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {data.patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
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
                          variant={'outline'}
                          className={cn(
                            'w-full px-2 py-5 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(Number(field.value), 'PPP', {
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
                          date < new Date('1900-01-01') ||
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
                      className="appearance-none px-2 py-5"
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
                    {selectedPatientConvenio !== 'Isento' && (
                      <Input
                        autoComplete="off"
                        type="text"
                        className="appearance-none px-2 py-5"
                        placeholder="Valor"
                        {...field}
                        onChange={(event) => {
                          formatValue(event)
                          field.onChange(event)
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
              className="p-9 text-lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && <Loader />}
              Enviar
            </Button>
          </form>
        </Form>
      ) : (
        <p className="text-center text-2xl font-bold text-red-800 max-sm:text-xl">
          Nenhum paciente cadastrado!
        </p>
      )}
    </>
  )
}

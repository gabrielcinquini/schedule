'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

import Loader from '@/components/Loader'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreatePatient } from '@/hooks/Patients/createPatient'
import { formatName } from '@/utils/utils'
import {
  registerPatientFormSchema,
  RegisterPatientFormType,
} from '@/validations/validations'

export function RegisterPatientForm() {
  const form = useForm<RegisterPatientFormType>({
    mode: 'onChange',
    resolver: zodResolver(registerPatientFormSchema),
  })

  const { mutateAsync: onCreatePatient } = useCreatePatient()

  const handleCreatePatient = async (value: RegisterPatientFormType) => {
    await onCreatePatient(value)
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 max-sm:gap-2 max-sm:text-sm"
        onSubmit={form.handleSubmit(handleCreatePatient)}
      >
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoComplete="off"
                    type="text"
                    className="px-2 py-5 max-sm:p-3"
                    placeholder="Nome"
                    {...field}
                    onChange={(event) => {
                      formatName(event)
                      field.onChange(event)
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
                    className="appearance-none px-2 py-5 max-sm:p-3"
                    placeholder="Sobrenome"
                    {...field}
                    onChange={(event) => {
                      formatName(event)
                      field.onChange(event)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
                  <SelectTrigger className="px-2 py-5">
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
          className="p-6 text-lg"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <Loader />}
          Enviar
        </Button>
      </form>
    </Form>
  )
}

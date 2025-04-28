'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'

import Loader from '@/components/Loader'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { MandatorySign } from '@/components/ui/mandatory-sign'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreatePatient } from '@/hooks/Patients/createPatient'
import { APP_ROUTES } from '@/routes/paths'
import { formatCPF, formatName } from '@/utils/utils'
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

  const handleCreatePatient = form.handleSubmit(async (formValues) => {
    await onCreatePatient(formValues).catch((e) => e)
  })

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 max-sm:gap-2 max-sm:text-sm"
        onSubmit={handleCreatePatient}
      >
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nome <MandatorySign />
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    type="text"
                    className="px-2 py-5 max-sm:p-3"
                    placeholder="John"
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
                <FormLabel>
                  Sobrenome <MandatorySign />
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    type="text"
                    className="appearance-none px-2 py-5 max-sm:p-3"
                    placeholder="Doe"
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
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  type="text"
                  className="px-2 py-5 max-sm:p-3"
                  placeholder="123.456.789-12"
                  {...field}
                  onChange={(event) => {
                    formatCPF(event)
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
          name="convenio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Convênio <MandatorySign />
              </FormLabel>
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
        <span className="text-sm">
          Ao continuar com o cadastro deste paciente, você concorda com o nosso{' '}
          <Link
            className="inline-block underline"
            href={APP_ROUTES.public.therms.registerPatient}
            target="_blank"
          >
            Termo de Responsabilidade e Consentimento para Inserção de Dados
          </Link>
        </span>
        <Button
          type="submit"
          className="p-6 max-sm:text-base sm:text-base"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && <Loader />}
          Enviar
        </Button>
      </form>
    </Form>
  )
}

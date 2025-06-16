'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

import { Form } from '@/components/ui/form'
import { useCreatePatient } from '@/hooks/Patients/createPatient'
import {
  registerOrUpdatePatientFormSchema,
  RegisterOrUpdatePatientFormType,
} from '@/validations/validations'

import { PatientForm } from './PatientForm'

export function RegisterPatientForm() {
  const form = useForm<RegisterOrUpdatePatientFormType>({
    mode: 'onChange',
    resolver: zodResolver(registerOrUpdatePatientFormSchema),
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
        <PatientForm />
      </form>
    </Form>
  )
}

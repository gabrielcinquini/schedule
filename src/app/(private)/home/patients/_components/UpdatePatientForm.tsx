'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Patient } from '@prisma/client'
import React from 'react'
import { useForm } from 'react-hook-form'

import { Form } from '@/components/ui/form'
import { useMutatePatient } from '@/hooks/Patients/mutatePatient'
import {
  registerOrUpdatePatientFormSchema,
  RegisterOrUpdatePatientFormType,
} from '@/validations/validations'

import { PatientForm } from './PatientForm'

interface UpdatePatientFormProps {
  patient: Patient
}

export function UpdatePatientForm({ patient }: UpdatePatientFormProps) {
  console.log(patient)
  const form = useForm<RegisterOrUpdatePatientFormType>({
    mode: 'onChange',
    resolver: zodResolver(registerOrUpdatePatientFormSchema),
    defaultValues: {
      name: patient.name.split(' ')[0],
      lastName: patient.name.split(' ')[1],
      cpf: patient.cpf || undefined,
      phone: patient.phone || undefined,
      convenio: patient.convenio,
    },
  })

  const { mutateAsync: onUpdatePatient } = useMutatePatient(patient.id)

  const handleUpdatePatient = form.handleSubmit(async (formValues) => {
    await onUpdatePatient(formValues).catch((e) => e)
  })

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 max-sm:gap-2 max-sm:text-sm"
        onSubmit={handleUpdatePatient}
      >
        <PatientForm />
      </form>
    </Form>
  )
}

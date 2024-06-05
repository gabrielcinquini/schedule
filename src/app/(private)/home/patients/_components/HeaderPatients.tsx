'use client'

import React from 'react'

import { CustomDialog } from '@/components/CustomDialog'
import { Widget } from '@/components/Widget'

import { RegisterPatientForm } from './RegisterPatientForm'

export function HeaderPatients() {
  return (
    <Widget title="Dashboard">
      <CustomDialog
        triggerText="Cadastrar paciente"
        title="Cadastrar paciente"
        description="Preencha os campos com os dados do paciente."
      >
        <RegisterPatientForm />
      </CustomDialog>
    </Widget>
  )
}

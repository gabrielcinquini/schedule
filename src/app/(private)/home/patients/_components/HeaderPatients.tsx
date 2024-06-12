'use client'

import React from 'react'

import { CustomDialog } from '../../_components/custom-dialog'
import { Widget } from '../../_components/widget'
import { RegisterPatientForm } from './RegisterPatientForm'

export function HeaderPatients() {
  return (
    <Widget title="Pacientes">
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
